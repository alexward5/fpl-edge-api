const players = [
  {
    id: 1,
    name: "Mo Salah",
  },
  {
    id: 2,
    name: "Harold Kane",
  },
];

const resolvers = {
  Query: {
    players: () => players,
  },
};

module.exports = resolvers;
