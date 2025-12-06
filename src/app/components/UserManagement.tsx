'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Mail, User as UserIcon, Calendar, Shield } from 'lucide-react';
import { User, UserCreationRequest, UserUpdateRequest, MembershipType } from '@/types/user.types';
import { UserService } from '@/lib/api/userservice';
import { MembershipTypeService } from '@/lib/api/membershiptypeservice';
import UserForm from './UserForm';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [membershipTypes, setMembershipTypes] = useState<MembershipType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
    loadMembershipTypes();
  }, []);

  const loadMembershipTypes = async () => {
    try {
      const data = await MembershipTypeService.getAllMembershipTypes();
      setMembershipTypes(data || []);
    } catch (err) {
      console.error('Erro ao carregar tipos de membership:', err);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await UserService.getAllUsers();
      setUsers(data || []);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao carregar usuários';
      setError(errorMsg);
      console.error('Erro ao carregar usuários:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return;

    try {
      setSubmitting(true);
      await UserService.deleteUser(id);
      setSuccess('Usuário deletado com sucesso');
      loadUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Erro ao deletar usuário');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (data: UserCreationRequest | UserUpdateRequest) => {
    try {
      setSubmitting(true);
      setError(null);

      if (editingUser) {
        // Check if role or membership changed - use admin endpoint
        const hasRoleOrMembershipChange = 
          ('userRole' in data && data.userRole !== editingUser.userRole) ||
          ('membershipTypeId' in data && data.membershipTypeId && 
           data.membershipTypeId !== editingUser.membershipType?.id);
        
        if (hasRoleOrMembershipChange) {
          await UserService.updateUserAsAdmin(editingUser.id, data as UserUpdateRequest);
        } else {
          await UserService.updateUser(editingUser.id, data as UserUpdateRequest);
        }
        setSuccess('Usuário atualizado com sucesso');
      } else {
        await UserService.createUser(data as UserCreationRequest);
        setSuccess('Usuário criado com sucesso');
      }

      setShowForm(false);
      setEditingUser(null);
      loadUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Erro ao salvar usuário';
      setError(errMsg);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getRoleBadge = (role: string) => {
    const roleStyles: Record<string, string> = {
      ADMIN: 'bg-red-100 text-red-800',
      EDITOR: 'bg-blue-100 text-blue-800',
      USER: 'bg-green-100 text-green-800',
    };
    return roleStyles[role] || 'bg-gray-100 text-gray-800';
  };

  const getActiveStatus = (active: boolean) => {
    return active
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Gerenciar Usuários</h2>
          <p className="text-muted-foreground mt-1">
            Crie, edite e delete usuários da plataforma
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition"
        >
          <Plus className="w-5 h-5" />
          Novo Usuário
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          ❌ {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          ✅ {success}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando usuários...</p>
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nenhum usuário encontrado</p>
          <button
            onClick={handleCreate}
            className="text-primary hover:underline"
          >
            Criar o primeiro usuário
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-foreground">
                      {user.name} {user.lastName}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${getRoleBadge(user.userRole)}`}>
                      {user.userRole}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${getActiveStatus(user.active)}`}>
                      {user.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition"
                    title="Editar"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    disabled={submitting}
                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded transition disabled:opacity-50"
                    title="Deletar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Infos Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Email */}
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground break-all">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Data de Criação */}
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Membro desde</p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Gênero */}
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Gênero</p>
                    <p className="text-sm font-medium text-foreground">
                      {user.gender || 'Não informado'}
                    </p>
                  </div>
                </div>

                {/* Membership */}
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Plano</p>
                    <p className="text-sm font-medium text-foreground">
                      {user.membershipType?.name || 'Sem plano'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detalhes Adicionais */}
              {(user.birthDate || user.timezone || user.locale) && (
                <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
                  {user.birthDate && (
                    <div>
                      <p className="text-muted-foreground">Data de Nascimento:</p>
                      <p className="text-foreground">{formatDate(user.birthDate)}</p>
                    </div>
                  )}
                  {user.timezone && (
                    <div>
                      <p className="text-muted-foreground">Timezone:</p>
                      <p className="text-foreground">{user.timezone}</p>
                    </div>
                  )}
                  {user.locale && (
                    <div>
                      <p className="text-muted-foreground">Idioma:</p>
                      <p className="text-foreground">{user.locale}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <UserForm
          user={editingUser}
          membershipTypes={membershipTypes}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
          isLoading={submitting}
        />
      )}
    </div>
  );
}
