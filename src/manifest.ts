export const manifest = {
  id: 'org.sdoolman.alomoves',
  version: '1.0.2',
  name: 'Alo Wellness Club',
  description:
    'Stream Alo Moves and Alo Wellness Club fitness, yoga, and mindfulness programs directly in Stremio.',
  logo: 'https://d357mttm70bw7x.cloudfront.net/37ac722a-09b9-4ad2-8a7c-739e84c826c0.jpg',
  background: 'https://d357mttm70bw7x.cloudfront.net/37ac722a-09b9-4ad2-8a7c-739e84c826c0.jpg',
  resources: [
    'catalog',
    {
      name: 'meta',
      types: ['series'],
      idPrefixes: ['alo:'],
    },
    {
      name: 'stream',
      types: ['series'],
      idPrefixes: ['alo:'],
    },
  ],
  types: ['series'],
  idPrefixes: ['alo:'],
  catalogs: [
    {
      type: 'series',
      id: 'alo_series',
      name: 'Alo Moves',
      posterShape: 'landscape',
      extra: [
        { name: 'search', isRequired: false },
        {
          name: 'genre',
          isRequired: false,
          options: [
            'Featured',
            'Yoga',
            'Fitness',
            'Mindfulness',
            'Skills',
            'Alo in the Wild',
            'Dylan Werner',
            'Ashley Galvin',
            'Briohny Smyth',
          ],
        },
        { name: 'skip', isRequired: false },
      ],
    },
  ],
};
