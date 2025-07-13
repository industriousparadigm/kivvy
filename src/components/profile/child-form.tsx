'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MagicalLoading } from '@/components/ui/magical-loading';
import { MagicalError } from '@/components/ui/magical-error';
import { Baby, Save, Calendar, AlertCircle, Heart } from 'lucide-react';

interface ChildProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  allergies: string;
  medicalNotes: string;
  emergencyContact: string;
}

interface ChildFormProps {
  initialChild?: ChildProfile & { id?: string };
  onSave?: (child: ChildProfile) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
}

export function ChildForm({ initialChild, onSave, onCancel, isEditing = false }: ChildFormProps) {
  const [child, setChild] = useState<ChildProfile>({
    firstName: initialChild?.firstName || '',
    lastName: initialChild?.lastName || '',
    dateOfBirth: initialChild?.dateOfBirth || '',
    allergies: initialChild?.allergies || '',
    medicalNotes: initialChild?.medicalNotes || '',
    emergencyContact: initialChild?.emergencyContact || '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: keyof ChildProfile, value: string) => {
    setChild(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    const age = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    return age >= 0 ? age : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validate age (must be between 0 and 18)
      const age = calculateAge(child.dateOfBirth);
      if (age === null || age < 0 || age > 18) {
        throw new Error('A criança deve ter entre 0 e 18 anos');
      }

      if (onSave) {
        await onSave(child);
      } else {
        // Default save to API
        const url = isEditing && initialChild?.id 
          ? `/api/users/children/${initialChild.id}`
          : '/api/users/children';
        
        const method = isEditing ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(child),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao guardar informações da criança');
        }
      }
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onCancel) onCancel();
      }, 2000);
    } catch (error) {
      console.error('Error saving child:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : 'Algo correu mal ao guardar as informações. Tenta novamente!'
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = child.firstName.trim() && child.lastName.trim() && child.dateOfBirth;
  const age = calculateAge(child.dateOfBirth);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center pb-2">
        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Baby className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          {isEditing ? 'Editar Informações' : 'Adicionar Filho'}
        </h2>
        <p className="text-gray-600">
          {isEditing 
            ? 'Atualiza as informações do teu pequeno'
            : 'Adiciona informações sobre o teu pequeno para personalizar as recomendações'
          }
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <MagicalError 
            title="Erro ao Guardar"
            message={error}
            showRetry={false}
            variant="gentle"
          />
        )}

        {success && (
          <div className="text-center py-4 px-6 bg-green-50 border border-green-200 rounded-xl">
            <div className="text-2xl mb-2">🎉</div>
            <p className="text-green-700 font-medium">
              {isEditing ? 'Informações atualizadas' : 'Filho adicionado'} com sucesso!
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                Primeiro Nome <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={child.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Ex: João"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Último Nome <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={child.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Ex: Silva"
                required
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Data de Nascimento <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={child.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              max={new Date().toISOString().split('T')[0]} // Can't be in the future
              required
            />
            {age !== null && (
              <p className="text-sm text-purple-600 font-medium">
                {age} anos de idade
              </p>
            )}
          </div>

          {/* Allergies */}
          <div className="space-y-2">
            <Label htmlFor="allergies" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Alergias
            </Label>
            <Textarea
              id="allergies"
              value={child.allergies}
              onChange={(e) => handleInputChange('allergies', e.target.value)}
              placeholder="Descreve qualquer alergia que o teu filho tenha (ex: amendoins, pólen, etc.)"
              rows={3}
            />
          </div>

          {/* Medical Notes */}
          <div className="space-y-2">
            <Label htmlFor="medicalNotes" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Notas Médicas
            </Label>
            <Textarea
              id="medicalNotes"
              value={child.medicalNotes}
              onChange={(e) => handleInputChange('medicalNotes', e.target.value)}
              placeholder="Qualquer informação médica importante que os instrutores devam saber"
              rows={3}
            />
          </div>

          {/* Emergency Contact */}
          <div className="space-y-2">
            <Label htmlFor="emergencyContact">
              Contacto de Emergência
            </Label>
            <Input
              id="emergencyContact"
              value={child.emergencyContact}
              onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
              placeholder="Nome e telemóvel (ex: Avó Maria - 912 345 678)"
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              disabled={loading || !isFormValid}
              className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-xl py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              {loading ? (
                <MagicalLoading variant="inline" size="sm" text="A guardar..." />
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  {isEditing ? 'Atualizar' : 'Adicionar Filho'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}