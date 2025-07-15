'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { ProfileForm } from '@/components/profile/profile-form';
import { ChildForm } from '@/components/profile/child-form';
import { MagicalLoading } from '@/components/ui/magical-loading';
import { MagicalError } from '@/components/ui/magical-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Baby,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Settings,
  Shield,
} from 'lucide-react';

interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  allergies?: string;
  medicalNotes?: string;
  emergencyContact?: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<
    'overview' | 'edit-profile' | 'add-child' | 'edit-child'
  >('overview');
  const [editingChild, setEditingChild] = useState<Child | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetchProfileData();
  }, [session, status, router]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileRes, childrenRes] = await Promise.all([
        fetch('/api/users/profile'),
        fetch('/api/users/children'),
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setUserProfile(profileData);
      } else if (profileRes.status !== 404) {
        throw new Error('Erro ao carregar perfil');
      }

      if (childrenRes.ok) {
        const childrenData = await childrenRes.json();
        setChildren(childrenData);
      } else if (childrenRes.status !== 404) {
        throw new Error('Erro ao carregar informações dos filhos');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError(
        error instanceof Error ? error.message : 'Erro ao carregar dados'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (profile: UserProfile) => {
    await fetch('/api/users/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });

    setUserProfile(profile);
    setActiveView('overview');
  };

  const handleChildSave = async (child: UserProfile) => {
    if (editingChild) {
      // Update existing child
      await fetch(`/api/users/children/${editingChild.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(child),
      });
    } else {
      // Add new child
      await fetch('/api/users/children', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(child),
      });
    }

    await fetchProfileData(); // Refresh the children list
    setActiveView('overview');
    setEditingChild(null);
  };

  const handleEditChild = (child: Child) => {
    setEditingChild(child);
    setActiveView('edit-child');
  };

  const handleDeleteChild = async (childId: string) => {
    if (
      !confirm('Tens a certeza que queres remover este filho do teu perfil?')
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/users/children/${childId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao remover filho');
      }

      await fetchProfileData(); // Refresh the children list
    } catch (error) {
      console.error('Error deleting child:', error);
      setError('Erro ao remover filho');
    }
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    return Math.floor(
      (today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <MagicalLoading text="A carregar o teu perfil..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <MagicalError
            title="Erro ao Carregar Perfil"
            message={error}
            onRetry={fetchProfileData}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with navigation */}
        <div className="mb-8">
          {activeView !== 'overview' && (
            <Button
              variant="ghost"
              onClick={() => {
                setActiveView('overview');
                setEditingChild(null);
              }}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          )}

          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
                O Teu Perfil
              </span>
            </h1>
            <p className="text-gray-600 text-lg">
              Gere as tuas informações pessoais e dos teus filhos
            </p>
          </div>
        </div>

        {/* Overview */}
        {activeView === 'overview' && (
          <div className="space-y-8">
            {/* User Profile Card */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Informações Pessoais
                      </h2>
                      <p className="text-gray-600">
                        {userProfile ? 'Perfil completo' : 'Perfil incompleto'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {userProfile && (
                      <Badge
                        variant="success"
                        className="flex items-center gap-1"
                      >
                        <Shield className="h-3 w-3" />
                        Verificado
                      </Badge>
                    )}
                    <Button
                      onClick={() => setActiveView('edit-profile')}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      {userProfile ? 'Editar' : 'Completar Perfil'}
                    </Button>
                  </div>
                </div>

                {userProfile ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Nome Completo
                      </p>
                      <p className="font-medium">
                        {userProfile.firstName} {userProfile.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="font-medium">{session?.user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Telemóvel</p>
                      <p className="font-medium">
                        {userProfile.phone || 'Não definido'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Cidade</p>
                      <p className="font-medium">
                        {userProfile.city || 'Não definida'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Completa o teu perfil para uma melhor experiência
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Children Section */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Baby className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Os Meus Filhos
                      </h2>
                      <p className="text-gray-600">
                        {children.length}{' '}
                        {children.length === 1
                          ? 'filho registado'
                          : 'filhos registados'}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setActiveView('add-child')}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Filho
                  </Button>
                </div>

                {children.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {children.map(child => (
                      <Card
                        key={child.id}
                        className="border border-purple-100 hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                                <Baby className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {child.firstName} {child.lastName}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {calculateAge(child.dateOfBirth)} anos
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditChild(child)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteChild(child.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {(child.allergies || child.medicalNotes) && (
                            <div className="text-sm text-gray-600">
                              {child.allergies && (
                                <p className="mb-1">
                                  <span className="font-medium">Alergias:</span>{' '}
                                  {child.allergies}
                                </p>
                              )}
                              {child.medicalNotes && (
                                <p>
                                  <span className="font-medium">Notas:</span>{' '}
                                  {child.medicalNotes}
                                </p>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Baby className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum filho registado
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Adiciona informações sobre os teus filhos para
                      personalizar as recomendações
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Profile Form */}
        {activeView === 'edit-profile' && (
          <ProfileForm
            initialProfile={userProfile || undefined}
            userEmail={session?.user?.email || undefined}
            onSave={handleProfileSave}
          />
        )}

        {/* Add/Edit Child Form */}
        {(activeView === 'add-child' || activeView === 'edit-child') && (
          <ChildForm
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            initialChild={(editingChild as any) || undefined}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSave={handleChildSave as any}
            onCancel={() => {
              setActiveView('overview');
              setEditingChild(null);
            }}
            isEditing={activeView === 'edit-child'}
          />
        )}
      </div>
    </div>
  );
}
