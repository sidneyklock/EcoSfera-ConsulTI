
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Cabeçalhos CORS para permitir chamadas da interface
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Tratar solicitação de preflight CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  // Inicializar cliente Supabase com role de serviço para acesso completo
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  try {
    // Extrair token Authorization do cabeçalho
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ 
          error: "Unauthorized", 
          message: "Token de autorização ausente ou inválido" 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Extrair o token
    const token = authHeader.split(" ")[1];
    
    // Verificar se o token existe e está ativo
    const { data: webhookToken, error: tokenError } = await supabase
      .from("webhook_tokens")
      .select("*")
      .eq("token", token)
      .eq("is_active", true)
      .single();
    
    if (tokenError || !webhookToken) {
      console.error("Erro ao validar token:", tokenError);
      return new Response(
        JSON.stringify({ 
          error: "Unauthorized", 
          message: "Token inválido ou inativo" 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Se chegou aqui, o token é válido
    // Extrair dados do corpo da requisição
    const requestData = await req.json();
    
    // Extrair execution_id ou gerar um novo
    const executionId = requestData.execution_id || crypto.randomUUID();
    
    // Registrar log de execução
    const { error: logError } = await supabase
      .from("webhook_logs")
      .insert({
        execution_id: executionId,
        user_id: webhookToken.created_by, // Usuário associado ao token
        webhook_token_id: webhookToken.id,
        request_data: requestData,
        ip_address: req.headers.get("x-forwarded-for") || null,
        status: "success",
        execution_timestamp: new Date().toISOString()
      });
    
    if (logError) {
      console.error("Erro ao registrar log:", logError);
    }
    
    // Processar a requisição e retornar resposta
    // Aqui você pode adicionar lógica específica para diferentes tipos de webhooks
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Webhook processado com sucesso",
        execution_id: executionId
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
    
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    
    // Tentar registrar falha se possível
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      await supabase
        .from("webhook_logs")
        .insert({
          execution_id: crypto.randomUUID(),
          status: "error",
          request_data: { error: error.message },
          execution_timestamp: new Date().toISOString()
        });
    } catch (logError) {
      console.error("Erro ao registrar falha:", logError);
    }
    
    return new Response(
      JSON.stringify({ 
        error: "Internal Server Error", 
        message: "Erro ao processar webhook" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
