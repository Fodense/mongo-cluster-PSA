### Запускаем docker-compose
```bash
docker-compose up -d
```

### Инициализируем Config Server и Shards
```bash
docker-compose exec config_server_1 sh -c "mongosh < /init/config_server.js"

docker-compose exec shard_1_node_1 sh -c "mongosh < /init/shard_1.js"
docker-compose exec shard_2_node_1 sh -c "mongosh < /init/shard_2.js"
```

### Добавляем Arbiters(Optional)
<details>
<summary>Что нужно сделать что бы добавить Arbiter?</summary>
<b>

Для того чтобы добавить arbiter в replica set, нужно подключиться к его primary
```bash
docker-compose exec shard_1_node_1 mongosh --port 27017
```
и выполнить команду
```
rs.addArb("shard_1_node_4:27017")
```
Так же может понадобиться изменить defaultWriteConcern. Выполняется в контейнере router
```
db.adminCommand({
  "setDefaultRWConcern" : 1,
  "defaultWriteConcern" : {
    "w" : 2
  }
})
```
</b>
</details>

### Инициализируем Mongos
```bash
docker-compose exec router sh -c "mongosh < /init/router.js"
```

### Включаем шардинг для БД
Включить шардинг для БД и можно указать ключ
```bash
docker-compose exec router mongosh --port 27017
```

```
sh.enableSharding("TestMongoCluster")

db.adminCommand( { shardCollection: "TestMongoCluster.TestCollection1", key: { oemNumber: "hashed", zipCode: 1, supplierId: 1 } } )
```
---

### Чекаем статусы
```bash
docker-compose exec router mongosh --port 27017
sh.status()
```

```bash
docker exec -it shard_1_node_1 bash -c "echo 'rs.status()' | mongosh --port 27017" 
docker exec -it shard_2_node_1 bash -c "echo 'rs.status()' | mongosh --port 27017" 
```

```bash
docker-compose exec router mongosh --port 27017
```
```
use TestMongoCluster
db.stats()
db.TestCollection1.getShardDistribution()
```
---

### Доп команды
```bash
docker exec -it config_server_1 bash -c "echo 'rs.status()' | mongosh --port 27017"

docker exec -it shard_1_node_1 bash -c "echo 'rs.help()' | mongosh --port 27017"
docker exec -it shard_1_node_1 bash -c "echo 'rs.status()' | mongosh --port 27017" 
docker exec -it shard_1_node_1 bash -c "echo 'rs.printReplicationInfo()' | mongosh --port 27017" 
docker exec -it shard_1_node_1 bash -c "echo 'rs.printSlaveReplicationInfo()' | mongosh --port 27017"
rs.conf()
```
---

### Удаляем контейнеры
```bash
docker-compose rm
```

### Удалить контейнеры и их volumes
```bash
docker-compose down -v
```