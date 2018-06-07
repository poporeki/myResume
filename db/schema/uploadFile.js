var mongoose = require('mongoose');
var uploadFileSchema = new mongoose.Schema({
    'source_name': String,
    'ext_name': String,
    'new_name': String,
    'save_path':String,
    'type': String,
    'size': Number,
    'hash': String,
    'last_modified_date': Date,
    'author_id':[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'myweb_user'
    }]

});


var User = mongoose.model('upload_file', uploadFileSchema);

module.exports = User;