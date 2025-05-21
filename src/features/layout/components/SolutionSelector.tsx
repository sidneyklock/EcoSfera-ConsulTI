
import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useSecureContextStore } from '@/stores/secureContextStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Solution {
  id: string;
  name: string;
}

// Tipagem correta para o formato de resposta do Supabase
interface UserSolutionResponse {
  solution_id: string;
  solutions: {
    id: string;
    name: string;
  };
}

export const SolutionSelector = () => {
  const { solutionId, setSolutionId, user } = useSecureContextStore();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar as soluções disponíveis para o usuário
  useEffect(() => {
    const fetchUserSolutions = async () => {
      if (!user || !isSupabaseConfigured()) {
        setSolutions([]);
        setLoading(false);
        return;
      }

      try {
        // Buscar soluções que o usuário tem acesso
        const { data, error } = await supabase
          .from('user_solutions')
          .select('solution_id, solutions(id, name)')
          .eq('user_id', user.id)
          .returns<UserSolutionResponse[]>();

        if (error) {
          console.error('Erro ao buscar soluções:', error);
          return;
        }

        // Correção do mapeamento para acessar corretamente os dados
        const formattedSolutions = data
          .filter(item => item.solutions != null) // Garantir que solutions existe
          .map((item) => ({
            id: item.solutions.id,
            name: item.solutions.name
          }));

        setSolutions(formattedSolutions);
      } catch (error) {
        console.error('Erro ao buscar soluções:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSolutions();
  }, [user]);

  // Manipular a mudança de solução
  const handleSolutionChange = (newSolutionId: string) => {
    // Verificar se o usuário tem acesso à solução selecionada
    const hasAccess = solutions.some(solution => solution.id === newSolutionId);
    
    if (hasAccess) {
      setSolutionId(newSolutionId);
    } else {
      console.error('Usuário não tem acesso à solução selecionada');
    }
  };

  // Encontrar nome da solução atual
  const currentSolution = solutions.find(s => s.id === solutionId);

  if (!user || solutions.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center">
      <Select
        value={solutionId || ''}
        onValueChange={handleSolutionChange}
        disabled={loading}
      >
        <SelectTrigger 
          className="w-[180px] bg-background border-none focus:ring-primary"
          aria-label="Selecionar solução"
        >
          <SelectValue placeholder="Selecionar solução">
            {loading ? 'Carregando...' : currentSolution?.name || 'Selecione uma solução'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {solutions.map((solution) => (
            <SelectItem 
              key={solution.id} 
              value={solution.id}
              className="flex items-center justify-between cursor-pointer"
            >
              <span>{solution.name}</span>
              {solution.id === solutionId && <Check className="h-4 w-4 ml-2" />}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
