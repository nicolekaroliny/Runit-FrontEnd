'use client';

import React, { useState, useEffect } from 'react';
import { User, UserCreationRequest, UserUpdateRequest, Gender } from '@/types/user.types';
import { X } from 'lucide-react';

interface UserFormProps {
  user?: User | null;
  onSubmit: (data: UserCreationRequest | UserUpdateRequest) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}

export default function UserForm({ user, onSubmit, onClose, isLoading }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '',
    gender: '' as Gender | '',
    timezone: '',
    locale: '',
    profilePictureUrl: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        lastName: user.lastName || '',
        email: user.email || '',
        password: '',
        birthDate: user.birthDate || '',
        gender: user.gender || '',
        timezone: user.timezone || '',
        locale: user.locale || '',
        profilePictureUrl: user.profilePictureUrl || '',
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Nome é obrigatório';
    if (!formData.lastName.trim()) errors.lastName = 'Sobrenome é obrigatório';
    if (!formData.email.trim()) errors.email = 'Email é obrigatório';
    else if (!formData.email.includes('@')) errors.email = 'Email inválido';

    if (!user && !formData.password) {
      errors.password = 'Senha é obrigatória para novo usuário';
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (user) {
        const updateData: UserUpdateRequest = {
          name: formData.name,
          lastName: formData.lastName,
          birthDate: formData.birthDate,
          gender: formData.gender as Gender | undefined,
          timezone: formData.timezone,
          locale: formData.locale,
          profilePictureUrl: formData.profilePictureUrl,
        };
        await onSubmit(updateData);
      } else {
        const createData: UserCreationRequest = {
          name: formData.name,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          birthDate: formData.birthDate,
          gender: formData.gender as Gender | undefined,
          timezone: formData.timezone,
          locale: formData.locale,
        };
        await onSubmit(createData);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    }
  };

  const genderOptions: Gender[] = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'];
  const localeOptions = ['pt-BR', 'en-US', 'es-ES', 'fr-FR', 'de-DE'];
  const timezoneOptions = ['America/Sao_Paulo', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
        {/* Header */}
        <div className="sticky top-0 bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between border-b border-border">
          <h2 className="text-xl font-bold">
            {user ? 'Editar Usuário' : 'Novo Usuário'}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-primary-foreground/80 hover:text-primary-foreground rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Nome *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  formErrors.name ? 'border-red-500' : 'border-border'
                }`}
                placeholder="João"
              />
              {formErrors.name && (
                <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Sobrenome *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  formErrors.lastName ? 'border-red-500' : 'border-border'
                }`}
                placeholder="Silva"
              />
              {formErrors.lastName && (
                <p className="text-xs text-red-500 mt-1">{formErrors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email {user ? '' : '*'}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading || !!user}
              className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                formErrors.email ? 'border-red-500' : 'border-border'
              } ${user ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="joao@example.com"
            />
            {formErrors.email && (
              <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
            )}
            {user && (
              <p className="text-xs text-muted-foreground mt-1">Email não pode ser alterado</p>
            )}
          </div>

          {/* Password (only for creation) */}
          {!user && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Senha *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  formErrors.password ? 'border-red-500' : 'border-border'
                }`}
                placeholder="••••••••"
              />
              {formErrors.password && (
                <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Data de Nascimento
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Gênero
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecione...</option>
                {genderOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === 'MALE' ? 'Masculino' : opt === 'FEMALE' ? 'Feminino' : opt === 'OTHER' ? 'Outro' : 'Prefiro não informar'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Timezone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Timezone
              </label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecione...</option>
                {timezoneOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Locale */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Idioma
              </label>
              <select
                name="locale"
                value={formData.locale}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecione...</option>
                {localeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Profile Picture URL */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              URL da Foto de Perfil
            </label>
            <input
              type="url"
              name="profilePictureUrl"
              value={formData.profilePictureUrl}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-6 border-t border-border">
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
              {isLoading && <span className="animate-spin">⏳</span>}
              {user ? 'Atualizar' : 'Criar'} Usuário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
