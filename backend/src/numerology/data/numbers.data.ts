export interface NumerologyMeaning {
  name: string;
  keywords: string[];
  strengths: string[];
  challenges: string[];
  careers: string[];
  lifePurpose: string;
  spiritualLesson: string;
  dailyAffirmation: string;
}

export const NUMEROLOGY_MEANINGS: Record<number, NumerologyMeaning> = {
  1: {
    name: 'O Líder',
    keywords: ['independência', 'originalidade', 'ambição', 'determinação'],
    strengths: [
      'Liderança natural',
      'Inovador',
      'Corajoso',
      'Pioneiro',
      'Autoconfiante',
    ],
    challenges: ['Teimosia', 'Egoísmo', 'Impaciência', 'Dominância excessiva'],
    careers: [
      'Empreendedor',
      'CEO',
      'Inventor',
      'Diretor',
      'Político',
      'Atleta profissional',
    ],
    lifePurpose:
      'Liderar e inspirar outros através da originalidade e independência, abrindo caminhos onde ninguém ousou trilhar.',
    spiritualLesson:
      'Aprender a equilibrar a força individual com a colaboração, reconhecendo que a verdadeira liderança serve ao coletivo.',
    dailyAffirmation:
      'Eu sou um pioneiro. Minha coragem e originalidade abrem portas para novas possibilidades.',
  },
  2: {
    name: 'O Diplomata',
    keywords: ['cooperação', 'harmonia', 'sensibilidade', 'parceria'],
    strengths: [
      'Diplomacia natural',
      'Intuição aguçada',
      'Pacificador',
      'Empático',
      'Bom ouvinte',
    ],
    challenges: [
      'Indecisão',
      'Dependência emocional',
      'Hipersensibilidade',
      'Passividade',
    ],
    careers: [
      'Mediador',
      'Conselheiro',
      'Diplomata',
      'Psicólogo',
      'Artista',
      'Músico',
    ],
    lifePurpose:
      'Trazer paz e harmonia aos ambientes, unindo pessoas através da compreensão mútua e do amor incondicional.',
    spiritualLesson:
      'Desenvolver autoconfiança mantendo a sensibilidade, aprendendo que cuidar de si é tão sagrado quanto cuidar dos outros.',
    dailyAffirmation:
      'Eu sou um canal de paz e harmonia. Minha sensibilidade é minha força.',
  },
  3: {
    name: 'O Comunicador',
    keywords: ['criatividade', 'expressão', 'alegria', 'otimismo'],
    strengths: [
      'Comunicação excepcional',
      'Criatividade abundante',
      'Carisma natural',
      'Otimismo contagiante',
      'Expressão artística',
    ],
    challenges: [
      'Dispersão',
      'Superficialidade',
      'Exagero',
      'Dificuldade de foco',
    ],
    careers: [
      'Escritor',
      'Ator',
      'Comediante',
      'Publicitário',
      'Designer',
      'Professor',
    ],
    lifePurpose:
      'Inspirar e elevar a humanidade através da expressão criativa, trazendo luz e alegria por onde passa.',
    spiritualLesson:
      'Canalizar a energia criativa com propósito, aprendendo que a verdadeira arte serve à evolução da consciência.',
    dailyAffirmation:
      'Minha criatividade é infinita. Eu expresso minha verdade com alegria e autenticidade.',
  },
  4: {
    name: 'O Construtor',
    keywords: ['estabilidade', 'trabalho', 'ordem', 'determinação'],
    strengths: [
      'Organização impecável',
      'Confiabilidade',
      'Praticidade',
      'Perseverança',
      'Honestidade',
    ],
    challenges: [
      'Rigidez',
      'Teimosia',
      'Tendência ao workaholic',
      'Resistência a mudanças',
    ],
    careers: [
      'Engenheiro',
      'Arquiteto',
      'Contador',
      'Gerente de projetos',
      'Advogado',
      'Cirurgião',
    ],
    lifePurpose:
      'Construir fundações sólidas para o futuro, criando estruturas que beneficiam gerações.',
    spiritualLesson:
      'Encontrar flexibilidade dentro da estrutura, aprendendo que a verdadeira estabilidade inclui a capacidade de adaptação.',
    dailyAffirmation:
      'Eu construo minha vida com dedicação e integridade. Cada passo sólido me leva ao meu destino.',
  },
  5: {
    name: 'O Aventureiro',
    keywords: ['liberdade', 'mudança', 'aventura', 'versatilidade'],
    strengths: [
      'Adaptabilidade',
      'Curiosidade insaciável',
      'Carisma magnético',
      'Coragem para o novo',
      'Versatilidade',
    ],
    challenges: [
      'Impulsividade',
      'Inconsistência',
      'Excesso de inquietação',
      'Dificuldade de compromisso',
    ],
    careers: [
      'Viajante',
      'Jornalista',
      'Vendedor',
      'Empreendedor digital',
      'Piloto',
      'Guia turístico',
    ],
    lifePurpose:
      'Expandir horizontes e mostrar ao mundo que a vida é uma aventura extraordinária cheia de possibilidades.',
    spiritualLesson:
      'Encontrar liberdade interior independente das circunstâncias externas, descobrindo que a maior aventura é a jornada interior.',
    dailyAffirmation:
      'Eu abraço a mudança com entusiasmo. A vida é minha grande aventura.',
  },
  6: {
    name: 'O Cuidador',
    keywords: ['amor', 'responsabilidade', 'família', 'harmonia'],
    strengths: [
      'Amor incondicional',
      'Senso de responsabilidade',
      'Habilidade de nutrir',
      'Criação de beleza',
      'Justiça',
    ],
    challenges: [
      'Perfeccionismo',
      'Controle excessivo',
      'Autossacrifício',
      'Preocupação exagerada',
    ],
    careers: [
      'Médico',
      'Enfermeiro',
      'Professor',
      'Terapeuta',
      'Decorador',
      'Chef de cozinha',
    ],
    lifePurpose:
      'Servir à humanidade através do amor e cuidado, criando ambientes de harmonia e beleza.',
    spiritualLesson:
      'Aprender a cuidar de si mesmo com o mesmo amor dedicado aos outros, entendendo que o autocuidado é serviço espiritual.',
    dailyAffirmation:
      'Meu amor cura e transforma. Eu cuido de mim para poder cuidar melhor dos outros.',
  },
  7: {
    name: 'O Místico',
    keywords: ['sabedoria', 'introspecção', 'espiritualidade', 'análise'],
    strengths: [
      'Mente analítica brilhante',
      'Intuição profunda',
      'Sabedoria espiritual',
      'Busca pela verdade',
      'Perfeccionismo intelectual',
    ],
    challenges: [
      'Isolamento',
      'Frieza emocional',
      'Ceticismo excessivo',
      'Dificuldade de confiar',
    ],
    careers: [
      'Cientista',
      'Pesquisador',
      'Filósofo',
      'Analista',
      'Escritor',
      'Mestre espiritual',
    ],
    lifePurpose:
      'Buscar e revelar verdades ocultas, servindo como ponte entre o mundo material e espiritual.',
    spiritualLesson:
      'Equilibrar a mente analítica com o coração aberto, descobrindo que a maior sabedoria vem da união entre razão e amor.',
    dailyAffirmation:
      'Eu sou um buscador da verdade. Minha sabedoria ilumina o caminho.',
  },
  8: {
    name: 'O Realizador',
    keywords: ['poder', 'abundância', 'sucesso', 'autoridade'],
    strengths: [
      'Visão de negócios',
      'Capacidade de manifestação',
      'Liderança executiva',
      'Determinação inabalável',
      'Gestão de recursos',
    ],
    challenges: [
      'Materialismo excessivo',
      'Autoritarismo',
      'Workaholic',
      'Dificuldade de delegar',
    ],
    careers: [
      'Executivo',
      'Banqueiro',
      'Investidor',
      'Empresário',
      'Juiz',
      'Político influente',
    ],
    lifePurpose:
      'Manifestar abundância e poder para criar transformações positivas no mundo material.',
    spiritualLesson:
      'Usar o poder e a riqueza como ferramentas de serviço, entendendo que a verdadeira abundância é compartilhada.',
    dailyAffirmation:
      'Eu manifesto abundância em todas as áreas da minha vida. Meu sucesso beneficia a todos.',
  },
  9: {
    name: 'O Humanitário',
    keywords: ['compaixão', 'universalidade', 'altruísmo', 'sabedoria'],
    strengths: [
      'Compaixão universal',
      'Visão global',
      'Generosidade infinita',
      'Sabedoria madura',
      'Capacidade de perdão',
    ],
    challenges: [
      'Dificuldade de desapego',
      'Dispersão de energia',
      'Idealismo excessivo',
      'Martírio',
    ],
    careers: [
      'Humanitário',
      'Artista',
      'Curador',
      'Professor espiritual',
      'Diplomata internacional',
      'Filantropo',
    ],
    lifePurpose:
      'Servir à humanidade com amor incondicional, elevando a consciência coletiva através do exemplo.',
    spiritualLesson:
      'Aprender o desapego amoroso, entendendo que servir não significa sacrificar-se, mas oferecer o melhor de si.',
    dailyAffirmation:
      'Eu sirvo com amor e sabedoria. Minha compaixão transforma o mundo.',
  },
};
