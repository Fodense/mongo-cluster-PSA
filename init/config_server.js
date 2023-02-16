rs.initiate({
    _id: "config_server_rs_1",
    configsvr: true,
    version: 1,
    members: [
        {_id: 0, host: 'config_server_1:27017'},
        {_id: 1, host: 'config_server_2:27017'}
    ]
})
