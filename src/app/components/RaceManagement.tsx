'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, MapPin, Calendar, Gauge } from 'lucide-react';
import { Race, RaceCreationRequest, RaceUpdateRequest } from '@/types/race.types';
import { RaceService } from '@/lib/api/raceservice';
import RaceForm from './RaceForm';

export default function RaceManagement() {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRace, setEditingRace] = useState<Race | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    loadRaces();
  }, [isMounted]);

  const loadRaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await RaceService.getAllRaces();
      setRaces(data || []);
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao carregar corridas';
      setError(errorMsg);
      console.error('Erro ao carregar corridas:', err);
      // Mostrar como lista vazia se não conseguir carregar
      setRaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      loadRaces();
      return;
    }

    try {
      setLoading(true);
      const data = await RaceService.searchRaces(term);
      setRaces(data);
    } catch (err) {
      setError('Erro ao buscar corridas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingRace(null);
    setShowForm(true);
  };

  const handleEdit = (race: Race) => {
    setEditingRace(race);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta corrida?')) return;

    try {
      setSubmitting(true);
      await RaceService.deleteRace(id);
      setSuccess('Corrida deletada com sucesso');
      loadRaces();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Erro ao deletar corrida');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (data: RaceCreationRequest | RaceUpdateRequest) => {
    try {
      setSubmitting(true);
      setError(null);

      if (editingRace) {
        await RaceService.updateRace(editingRace.id, data as RaceUpdateRequest);
        setSuccess('Corrida atualizada com sucesso');
      } else {
        await RaceService.createRace(data as RaceCreationRequest);
        setSuccess('Corrida criada com sucesso');
      }

      setShowForm(false);
      setEditingRace(null);
      loadRaces();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar corrida');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRaces = races.filter((race) =>
    race.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    race.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    return status === 'ACTIVE'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  const getStatusLabel = (status: string) => {
    return status === 'ACTIVE' ? 'Publicada' : 'Rascunho';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Gerenciar Corridas</h2>
          <p className="text-muted-foreground mt-1">
            Crie, edite e delete corridas da plataforma
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition"
        >
          <Plus className="w-5 h-5" />
          Nova Corrida
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
          placeholder="Buscar por nome ou cidade..."
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
            <p className="text-muted-foreground">Carregando corridas...</p>
          </div>
        </div>
      ) : filteredRaces.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nenhuma corrida encontrada</p>
          <button
            onClick={handleCreate}
            className="text-primary hover:underline"
          >
            Criar a primeira corrida
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRaces.map((race) => (
            <div
              key={race.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-foreground">{race.name}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusBadge(race.status)}`}>
                      {getStatusLabel(race.status)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(race)}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition"
                    title="Editar"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(race.id)}
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
                {/* Data */}
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Data</p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(race.raceDate)}
                    </p>
                  </div>
                </div>

                {/* Localização */}
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Localização</p>
                    <p className="text-sm font-medium text-foreground">
                      {race.city}, {race.state}
                    </p>
                  </div>
                </div>

                {/* Distância */}
                <div className="flex items-center gap-3">
                  <Gauge className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Distância</p>
                    <p className="text-sm font-medium text-foreground">
                      {race.raceDistanceKm} km
                    </p>
                  </div>
                </div>

                {/* Participantes */}
                <div>
                  <p className="text-xs text-muted-foreground">Participantes</p>
                  <p className="text-sm font-medium text-foreground">
                    {race.maxParticipants ? `Até ${race.maxParticipants}` : 'Ilimitado'}
                  </p>
                </div>
              </div>

              {/* Detalhes Adicionais */}
              {(race.registrationUrl || race.organizerContact) && (
                <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
                  {race.registrationUrl && (
                    <div>
                      <p className="text-muted-foreground">Inscrição:</p>
                      <a
                        href={race.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all"
                      >
                        {race.registrationUrl}
                      </a>
                    </div>
                  )}
                  {race.organizerContact && (
                    <div>
                      <p className="text-muted-foreground">Contato:</p>
                      <p className="text-foreground">{race.organizerContact}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Coordenadas */}
              <div className="mt-2 text-xs text-muted-foreground">
                📍 {race.latitude.toFixed(4)}, {race.longitude.toFixed(4)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <RaceForm
          race={editingRace}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingRace(null);
          }}
          isLoading={submitting}
        />
      )}
    </div>
  );
}
