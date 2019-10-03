class AdminUser {
  constructor(model) {
    this.Model = model;
  }

  async createAdminUser(data) {
    return new this.Model(data).save();
  }

  async getAdminUserByEmail(email) {
    return this.Model.findOne({ email });
  }

  /**
   * @description Updates user data in the database
   * @param {string} email The email of the user to update
   * @param {object} update The data to patch with the existing user data
   * @returns {Promise} A promise that resolves or reject to the result of the database operation
   */
  async updateUser(email, update) {
    return this.Model.updateOne({ email }, update);
  }
}


export default {
  AdminUser,
};
