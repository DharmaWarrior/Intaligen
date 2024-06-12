// data.js
export const data = {
  name: 'Primary WorkStation',
  toggled: true,
  children: [
    {
      name: 'Packaging Section',
      capacity: '100 units/day',
      children: [
        { name: 'pws1' },
        { name: 'pws2' },
        { name: 'pws3' },
        { name: 'pws4' },
        { name: 'pws5' },
      ],
    },
    {
      name: 'Bathi Machines Section',
      capacity: '50 units/day',
      children: [
        { name: 'bathi machine 1' },
        { name: 'bathi machine 2' },
        { name: 'bathi machine 3' },
        { name: 'bathi machine 4' },
      ],
    },
    {
      name: 'Dipping Section',
      capacity: '200 units/day',
      children: [
        { name: 'Labour 1' },
      ],
    },
  ],
};
