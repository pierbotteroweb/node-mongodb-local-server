# Running a MongoDB database on Docker

If you have a mongodb database on your local machine and you want your doker mongodb to import the whole
database content on your local machine, copy the "data" folder thatis used onthemongodb installand paste it onthe rootfolder of this project. Then, the fllowing line will map the content of your local data folder with the folder that mongodb will use on Doker

      - G:/docker-mongodb/data:/data/db

By running 

      docker-compose up -d 
      
the database will be created using all the collections and documents of your local mongodb install. 

docker-compose down
docker system prune -a
docker-compose up -d


docker exec mongodb-container mongodump --host mongodb --archive=/backups/mongodb_backup.archive

docker exec mongodb-container mongorestore --host mongodb  --archive=/backups/mongodb_backup.archive --drop
