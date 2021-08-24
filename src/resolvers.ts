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

export default resolvers;
