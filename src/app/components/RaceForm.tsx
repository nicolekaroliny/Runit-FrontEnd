'use client';

import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar } from 'lucide-react';
import { Race, RaceCreationRequest, RaceUpdateRequest, RaceStatus } from '@/types/race.types';

interface RaceFormProps {
  race?: Race | null;
  onSubmit: (data: RaceCreationRequest | RaceUpdateRequest) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

const RaceForm: React.FC<RaceFormProps> = ({ race, onSubmit, onClose, isLoading = false }) => {
  const [formData, setFormData] = useState<RaceCreationRequest | RaceUpdateRequest>({
    name: '',
    raceDate: '',
    city: '',
    state: '',
    latitude: 0,
    longitude: 0,
    raceDistanceKm: 0,
    status: 'PENDING',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form if editing
  useEffect(() => {
    if (race) {
      setFormData({
        name: race.name,
        raceDate: race.raceDate,
        city: race.city,
        state: race.state,
        latitude: race.latitude,
        longitude: race.longitude,
        raceDistanceKm: race.raceDistanceKm,
        status: race.status,
        registrationUrl: race.registrationUrl,
        organizerContact: race.organizerContact,
        maxParticipants: race.maxParticipants,
      });
    }
  }, [race]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    if (formData.name && formData.name.length > 255) {
      newErrors.name = 'Nome não pode exceder 255 caracteres';
    }

    if (!formData.raceDate) {
      newErrors.raceDate = 'Data é obrigatória';
    } else if (new Date(formData.raceDate) < new Date()) {
      newErrors.raceDate = 'Data deve ser no presente ou futuro';
    }

    if (!formData.city?.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }
    if (formData.city && formData.city.length > 100) {
      newErrors.city = 'Cidade não pode exceder 100 caracteres';
    }

    if (!formData.state?.trim()) {
      newErrors.state = 'Estado é obrigatório';
    }
    if (formData.state && formData.state.length > 100) {
      newErrors.state = 'Estado não pode exceder 100 caracteres';
    }

    if (formData.latitude === null || formData.latitude === undefined) {
      newErrors.latitude = 'Latitude é obrigatória';
    } else if (formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = 'Latitude inválida (-90 a 90)';
    }

    if (formData.longitude === null || formData.longitude === undefined) {
      newErrors.longitude = 'Longitude é obrigatória';
    } else if (formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = 'Longitude inválida (-180 a 180)';
    }

    if (!formData.raceDistanceKm) {
      newErrors.raceDistanceKm = 'Distância é obrigatória';
    } else if (formData.raceDistanceKm <= 0) {
      newErrors.raceDistanceKm = 'Distância deve ser maior que 0';
    }

    if (formData.registrationUrl && formData.registrationUrl.length > 500) {
      newErrors.registrationUrl = 'URL não pode exceder 500 caracteres';
    }

    if (formData.organizerContact && formData.organizerContact.length > 255) {
      newErrors.organizerContact = 'Contato não pode exceder 255 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro ao salvar corrida:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const numericFields = ['latitude', 'longitude', 'raceDistanceKm', 'maxParticipants'];

    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? (value ? parseFloat(value) : '') : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const statusOptions: { value: RaceStatus; label: string }[] = [
    { value: 'PENDING', label: 'Pendente' },
    { value: 'ACTIVE', label: 'Ativa' },
    { value: 'COMPLETED', label: 'Concluída' },
    { value: 'CANCELED', label: 'Cancelada' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-2xl font-bold text-foreground">
            {race ? 'Editar Corrida' : 'Criar Nova Corrida'}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nome da Corrida *
            </label>
            <input
              type="text"
              name="name"
              value={(formData as any).name}
              onChange={handleChange}
              placeholder="Ex: Corrida de São Paulo"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Grid 2 colunas */}
          <div className="grid grid-cols-2 gap-4">
            {/* Data da Corrida */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data *
              </label>
              <input
                type="date"
                name="raceDate"
                value={(formData as any).raceDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.raceDate && <p className="text-red-500 text-xs mt-1">{errors.raceDate}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Status *</label>
              <select
                name="status"
                value={(formData as any).status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Localização */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Localização *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="city"
                  value={(formData as any).city}
                  onChange={handleChange}
                  placeholder="Cidade"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <input
                  type="text"
                  name="state"
                  value={(formData as any).state}
                  onChange={handleChange}
                  placeholder="Estado/UF"
                  maxLength={100}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>
            </div>
          </div>

          {/* Coordenadas */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">Coordenadas GPS *</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  name="latitude"
                  value={(formData as any).latitude}
                  onChange={handleChange}
                  placeholder="Latitude (-90 a 90)"
                  step="0.000001"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>}
              </div>
              <div>
                <input
                  type="number"
                  name="longitude"
                  value={(formData as any).longitude}
                  onChange={handleChange}
                  placeholder="Longitude (-180 a 180)"
                  step="0.000001"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>}
              </div>
            </div>
          </div>

          {/* Distância */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Distância (km) *
            </label>
            <input
              type="number"
              name="raceDistanceKm"
              value={(formData as any).raceDistanceKm}
              onChange={handleChange}
              placeholder="Ex: 10.5"
              step="0.01"
              min="0.01"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.raceDistanceKm && (
              <p className="text-red-500 text-xs mt-1">{errors.raceDistanceKm}</p>
            )}
          </div>

          {/* Campos Opcionais */}
          <div className="space-y-4 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground font-medium uppercase">Campos Opcionais</p>

            {/* Max Participantes */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Máximo de Participantes
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={(formData as any).maxParticipants || ''}
                onChange={handleChange}
                placeholder="Ex: 500"
                min="1"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* URL de Registro */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                URL de Inscrição
              </label>
              <input
                type="url"
                name="registrationUrl"
                value={(formData as any).registrationUrl || ''}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.registrationUrl && (
                <p className="text-red-500 text-xs mt-1">{errors.registrationUrl}</p>
              )}
            </div>

            {/* Contato Organizador */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Contato do Organizador
              </label>
              <input
                type="text"
                name="organizerContact"
                value={(formData as any).organizerContact || ''}
                onChange={handleChange}
                placeholder="contato@corrida.com"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.organizerContact && (
                <p className="text-red-500 text-xs mt-1">{errors.organizerContact}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end border-t border-border pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Salvando...
                </>
              ) : race ? (
                'Atualizar'
              ) : (
                'Criar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaceForm;
