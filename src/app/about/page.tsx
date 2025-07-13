import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Shield, Heart, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sobre Nós | KidsHiz',
  description:
    'Conheça a KidsHiz, a plataforma que conecta famílias às melhores atividades para crianças no Porto e Matosinhos.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50 page-enter">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16 stagger-children">
          <h1 className="text-4xl sm:text-5xl font-light text-rose-900 mb-6 leading-tight">
            Onde pequenos sonhos
            <br />
            <span className="font-semibold text-amber-800">
              encontram o seu lugar
            </span>
          </h1>
          <p className="text-lg text-rose-700 max-w-3xl mx-auto leading-relaxed">
            Conectamos mães carinhosas às experiências mais especiais para os
            seus pequenos no Porto e Matosinhos, criando memórias que durarão
            para sempre e promovendo momentos de pura alegria.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 stagger-children">
          <div className="card-enter">
            <h2 className="text-3xl font-light text-rose-900 mb-6">
              A Nossa Missão
            </h2>
            <p className="text-rose-700 mb-4 leading-relaxed">
              A KidsHiz nasceu do coração de uma mãe que queria simplificar a
              busca por experiências especiais para os seus filhos. Acreditamos
              que cada criança merece oportunidades para explorar, descobrir e
              crescer rodeada de amor e cuidado.
            </p>
            <p className="text-rose-700 leading-relaxed">
              Trabalhamos para criar uma ponte entre famílias carinhosas e
              prestadores dedicados, garantindo momentos de pura alegria e
              tranquilidade em cada reserva.
            </p>
          </div>
          <div className="bg-white/80 rounded-3xl shadow-lg p-8 border border-rose-100 gentle-hover card-enter">
            <h3 className="text-xl font-medium text-rose-900 mb-6">
              Os Nossos Valores
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-rose-600" />
                </div>
                <span className="text-rose-800 font-medium">
                  Segurança e tranquilidade
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Heart className="h-5 w-5 text-amber-600" />
                </div>
                <span className="text-rose-800 font-medium">
                  Cuidado personalizado
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 text-rose-600" />
                </div>
                <span className="text-rose-800 font-medium">
                  Experiências especiais
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-amber-600" />
                </div>
                <span className="text-rose-800 font-medium">
                  Comunidade acolhedora
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-16 stagger-children">
          <Card className="text-center bg-white/80 border-rose-100 gentle-hover card-enter">
            <CardHeader>
              <CardTitle className="text-3xl font-light text-rose-600">
                5+
              </CardTitle>
              <CardDescription className="text-rose-700 font-medium">
                Experiências Únicas
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center bg-white/80 border-amber-100 gentle-hover card-enter">
            <CardHeader>
              <CardTitle className="text-3xl font-light text-amber-600">
                5+
              </CardTitle>
              <CardDescription className="text-rose-700 font-medium">
                Prestadores Carinhosos
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center bg-white/80 border-rose-100 gentle-hover card-enter">
            <CardHeader>
              <CardTitle className="text-3xl font-light text-rose-600">
                100+
              </CardTitle>
              <CardDescription className="text-rose-700 font-medium">
                Momentos de Alegria
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center bg-white/80 border-amber-100 gentle-hover card-enter">
            <CardHeader>
              <CardTitle className="text-3xl font-light text-amber-600">
                2
              </CardTitle>
              <CardDescription className="text-rose-700 font-medium">
                Cidades Especiais
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How it Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-light text-rose-900 text-center mb-12">
            Como Funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8 stagger-children">
            <Card className="text-center bg-white/80 border-rose-100 gentle-hover card-enter">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6 floating-heart">
                  <Calendar className="h-8 w-8 text-rose-600" />
                </div>
                <CardTitle className="text-rose-900 font-medium mb-3">
                  1. Descobre
                </CardTitle>
                <CardDescription className="text-rose-700 leading-relaxed">
                  Explora experiências mágicas pensadas especialmente para a
                  idade e personalidade do teu pequeno
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center bg-white/80 border-amber-100 gentle-hover card-enter">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6 floating-heart">
                  <Heart className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle className="text-rose-900 font-medium mb-3">
                  2. Reserva
                </CardTitle>
                <CardDescription className="text-rose-700 leading-relaxed">
                  Garante o lugar do teu filho de forma simples e segura, com
                  toda a tranquilidade
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center bg-white/80 border-rose-100 gentle-hover card-enter">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6 floating-heart">
                  <Star className="h-8 w-8 text-rose-600" />
                </div>
                <CardTitle className="text-rose-900 font-medium mb-3">
                  3. Cria Memórias
                </CardTitle>
                <CardDescription className="text-rose-700 leading-relaxed">
                  Observa os olhinhos do teu filho brilharem de alegria em
                  momentos que ficarão para sempre no coração
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-16 card-enter">
          <h2 className="text-3xl font-light text-rose-900 mb-6">
            A Nossa Família
          </h2>
          <p className="text-rose-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Somos uma família dedicada de mães, pais, educadores e profissionais
            apaixonados que trabalham todos os dias para criar momentos
            especiais e facilitar a vida das famílias.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200">
              Amor pela Família
            </Badge>
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
              Educação Carinhosa
            </Badge>
            <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200">
              Parentalidade
            </Badge>
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
              Comunidade Acolhedora
            </Badge>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-white/80 rounded-3xl shadow-lg p-8 border border-rose-100 card-enter">
          <h3 className="text-2xl font-light text-rose-900 mb-4">
            Tens Alguma Questão?
          </h3>
          <p className="text-rose-700 mb-8 leading-relaxed">
            Estamos aqui para ajudar e esclarecer qualquer dúvida. Fala
            connosco!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="nurturing-button warm-gradient-hover text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Fala Connosco
            </a>
            <Link
              href="/activities"
              className="bg-white/90 text-rose-800 px-8 py-4 rounded-full hover:bg-white border-2 border-rose-200 hover:border-rose-300 transition-all duration-300 font-medium"
            >
              Ver Atividades
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
