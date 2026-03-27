export default [
  {
    type: 'list',
    name: 'projectType',
    message: 'Project type?',
    choices: [
      { name: 'Web App  — full stack with Twig, forms, ORM', value: 'webapp' },
      { name: 'API      — REST API with Symfony skeleton', value: 'api' },
      {
        name: 'Microservice — minimal Symfony skeleton',
        value: 'microservice',
      },
    ],
  },
  {
    type: 'list',
    name: 'database',
    message: 'Database?',
    choices: [
      { name: 'MySQL', value: 'mysql' },
      { name: 'PostgreSQL', value: 'postgresql' },
      { name: 'SQLite', value: 'sqlite' },
      { name: 'None', value: 'none' },
    ],
  },
  {
    type: 'confirm',
    name: 'docker',
    message: 'Include Docker config?',
    default: false,
  },
];
