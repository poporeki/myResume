var mongoose = require('mongoose');
var uploadFileSchema = new mongoose.Schema({
  is_qiniu: Boolean,
  source_name: String,
  ext_name: String,
  new_name: String,
  save_path: String,
  data_base64: String,
  has_thumbnail: Boolean,
  type: String,
  size: Number,
  hash: String,
  last_modified_date: Date,
  author_id: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'myweb_user'
  }]

}, {
  timestamps: {
    createdAt: 'create_time',
    updatedAt: 'update_time'
  }
});


var User = mongoose.model('upload_file', uploadFileSchema);

module.exports = User;