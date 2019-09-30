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

  async updateUser(email, update) {
    return this.Model.updateOne({ email }, update);
  }
}


export default {
  AdminUser,
};
