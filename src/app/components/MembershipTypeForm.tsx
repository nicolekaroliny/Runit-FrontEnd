'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { MembershipType } from '@/types/user.types';
import {
  MembershipTypeCreationRequest,
  MembershipTypeUpdateRequest,
} from '@/lib/api/membershiptypeservice';

interface MembershipTypeFormProps {
  membership?: MembershipType | null;
  onSubmit: (data: MembershipTypeCreationRequest | MembershipTypeUpdateRequest) => void;
  onClose: () => void;
  isLoading: boolean;
}

export default function MembershipTypeForm({
  membership,
  onSubmit,
  onClose,
  isLoading,
}: MembershipTypeFormProps) {
  const [formData, setFormData] = useState<MembershipTypeCreationRequest>({
    name: '',
    monthlyPrice: 0,
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (membership) {
      setFormData({
        name: membership.name,
        monthlyPrice: membership.monthlyPrice,
        description: membership.description || '',
      });
    }
  }, [membership]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (formData.monthlyPrice === undefined || formData.monthlyPrice === null) {
      newErrors.monthlyPrice = 'Preço é obrigatório';
    } else if (Number(formData.monthlyPrice) < 0) {
      newErrors.monthlyPrice = 'Preço não pode ser negativo';
    }

    if (formData.description && formData.description.length > 255) {
      newErrors.description = 'Descrição não pode ter mais de 255 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit(formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'monthlyPrice') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg shadow-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-xl font-bold text-foreground">
            {membership ? 'Editar Membership' : 'Novo Membership'}
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nome *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="ex: Premium"
              className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 transition ${
                errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-border focus:ring-primary'
              }`}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Monthly Price */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Preço Mensal (R$) *
            </label>
            <input
              type="number"
              name="monthlyPrice"
              value={formData.monthlyPrice}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 transition ${
                errors.monthlyPrice
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-border focus:ring-primary'
              }`}
              disabled={isLoading}
            />
            {errors.monthlyPrice && (
              <p className="text-sm text-red-500 mt-1">{errors.monthlyPrice}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Descrição
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descreva os benefícios deste membership..."
              rows={4}
              maxLength={255}
              className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 transition resize-none ${
                errors.description
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-border focus:ring-primary'
              }`}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.description.length}/255 caracteres
            </p>
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition disabled:opacity-50 font-medium"
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
