module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'example@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Street',
        gender: true,
        typeRole: 'admin',
        keyRole: 'admin_key',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Thêm nhiều người dùng ở đây
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
