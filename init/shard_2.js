rs.initiate({
    _id: "shard_rs_2",
    version: 1,
    members: [
        {_id: 0, host: "shard_2_node_1:27017"},
        {_id: 1, host: "shard_2_node_2:27017"}
    ]
})