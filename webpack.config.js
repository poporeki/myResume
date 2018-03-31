const path=require('path');

module.exports={
    entry:'./app.js',
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'my-first-webpack.bunndle.js'
    },
    module:{
        rules:[
            {
                test:/\.text$/,
                use:'raw-loader'
            }
        ]
    }
}