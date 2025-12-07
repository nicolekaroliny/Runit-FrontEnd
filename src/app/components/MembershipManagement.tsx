'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, DollarSign, FileText } from 'lucide-react';
import { MembershipType } from '@/types/user.types';
import {
  MembershipTypeService,
  MembershipTypeCreationRequest,
  MembershipTypeUpdateRequest,
} from '@/lib/api/membershiptypeservice';
import MembershipTypeForm from './MembershipTypeForm';

export default function MembershipManagement() {
  const [memberships, setMemberships] = useState<MembershipType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMembership, setEditingMembership] = useState<MembershipType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    loadMemberships();
  }, [isMounted]);

  const loadMemberships = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await MembershipTypeService.getAllMembershipTypes();
      setMemberships(data || []);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao carregar memberships';
      setError(errorMsg);
      console.error('Erro ao carregar memberships:', err);
      setMemberships([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCreate = () => {
    setEditingMembership(null);
    setShowForm(true);
  };

  const handleEdit = (membership: MembershipType) => {
    setEditingMembership(membership);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este tipo de membership?')) return;

    try {
      setSubmitting(true);
      await MembershipTypeService.deleteMembershipType(id);
      setSuccess('Membership deletado com sucesso');
      loadMemberships();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Erro ao deletar membership');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (data: MembershipTypeCreationRequest | MembershipTypeUpdateRequest) => {
    try {
      setSubmitting(true);
      setError(null);

      if (editingMembership) {
        await MembershipTypeService.updateMembershipType(editingMembership.id, data as MembershipTypeUpdateRequest);
        setSuccess('Membership atualizado com sucesso');
      } else {
        await MembershipTypeService.createMembershipType(data as MembershipTypeCreationRequest);
        setSuccess('Membership criado com sucesso');
      }

      setShowForm(false);
      setEditingMembership(null);
      loadMemberships();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Erro ao salvar membership';
      setError(errMsg);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMemberships = memberships.filter((membership) =>
    membership.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (membership.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Gerenciar Memberships</h2>
          <p className="text-muted-foreground mt-1">
            Crie, edite e delete tipos de membership da plataforma
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition"
        >
          <Plus className="w-5 h-5" />
          Novo Membership
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
          placeholder="Buscar por nome ou descrição..."
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
            <p className="text-muted-foreground">Carregando memberships...</p>
          </div>
        </div>
      ) : filteredMemberships.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nenhum membership encontrado</p>
          <button
            onClick={handleCreate}
            className="text-primary hover:underline"
          >
            Criar o primeiro membership
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMemberships.map((membership) => (
            <div
              key={membership.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground">{membership.name}</h3>
                  {membership.description && (
                    <p className="text-sm text-muted-foreground mt-1">{membership.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(membership)}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition"
                    title="Editar"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(membership.id)}
                    disabled={submitting}
                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded transition disabled:opacity-50"
                    title="Deletar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Infos Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Price */}
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Preço Mensal</p>
                    <p className="text-sm font-medium text-foreground">
                      {formatPrice(membership.monthlyPrice)}
                    </p>
                  </div>
                </div>

                {/* Created At */}
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Criado em</p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(membership.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Type Badge */}
                <div>
                  <p className="text-xs text-muted-foreground">Tipo</p>
                  <span
                    className={`inline-block text-xs px-3 py-1 rounded-full font-semibold mt-1 ${
                      membership.monthlyPrice === 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {membership.monthlyPrice === 0 ? 'Gratuito' : 'Premium'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <MembershipTypeForm
          membership={editingMembership}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingMembership(null);
          }}
          isLoading={submitting}
        />
      )}
    </div>
  );
}
