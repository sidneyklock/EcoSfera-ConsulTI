
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChatInterface } from "@/components/chat/ChatInterface";

const ChatPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Chat com IA</h1>
        <p className="text-muted-foreground mt-2">
          Converse com nosso assistente inteligente para obter ajuda e insights sobre seus dados e projetos
        </p>
      </div>
      <ChatInterface />
    </DashboardLayout>
  );
};

export default ChatPage;
