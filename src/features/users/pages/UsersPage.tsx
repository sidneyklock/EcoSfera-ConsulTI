
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search } from "lucide-react";
import { PageLayout } from "@/layouts";

// Dados simulados de usuários
const mockUsers = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@exemplo.com",
    role: "admin",
    status: "active",
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    name: "Maria Oliveira",
    email: "maria@exemplo.com",
    role: "user",
    status: "active",
    createdAt: "2023-02-10",
  },
  {
    id: "3",
    name: "Pedro Santos",
    email: "pedro@exemplo.com",
    role: "user",
    status: "inactive",
    createdAt: "2023-03-05",
  },
  {
    id: "4",
    name: "Ana Costa",
    email: "ana@exemplo.com",
    role: "user",
    status: "active",
    createdAt: "2023-03-20",
  },
  {
    id: "5",
    name: "Carlos Ferreira",
    email: "carlos@exemplo.com",
    role: "user",
    status: "active",
    createdAt: "2023-04-12",
  },
];

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar usuários com base no termo de pesquisa
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout 
      title="Gerenciar Usuários" 
      description="Visualize e gerencie todos os usuários do sistema"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Usuário
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {user.role === "admin" ? "Admin" : "Usuário"}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status === "active" ? "Ativo" : "Inativo"}
                  </span>
                </TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageLayout>
  );
};

export default UsersPage;
