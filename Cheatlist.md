### Docker – Images / Conteneurs / Réseaux
docker pull <image>
docker images
docker rmi <image_id>
docker build -t <name>:<tag> .
docker tag <image_id> <acr>.azurecr.io/<name>:latest
docker push <acr>.azurecr.io/<name>:latest
docker save <name>:<tag> > file.tar
docker load < file.tar
docker run -d --name <container> <image>
docker ps
docker ps -a
docker stop/start/restart <id>
docker exec -it <id> bash
docker logs <id>
docker rm <id>
docker volume ls
docker volume create <vol_name>
docker volume inspect <vol_name>
docker network ls
docker network create -d bridge <net_name>
docker run --network <net_name> ...
docker login <acr>.azurecr.io
sudo usermod -aG docker <user>
docker run -d --name mariadb --network <net_name> -p 3306:3306 -v <vol_name>:/var/lib/mysql -e MARIADB_USER=<user> -e MARIADB_PASSWORD=<pass> -e MARIADB_DATABASE=<db> -e MARIADB_ROOT_PASSWORD=<root> mariadb:latest
docker run -d --name backend --network <net_name> -p 8080:8080 --env-file ./backend.env <acr>.azurecr.io/todo-backend-scd:latest
docker run -d --name frontend --network <net_name> -p 80:80 <acr>.azurecr.io/todo-frontend-scd:latest

### Azure CLI – VM / Réseau
az login
az account list
az account set --subscription <sub_id>
az group create --name <rg> --location <loc>
az vm list -o table
az vm create --resource-group <rg> --name <vm> --image <img> --admin-username <user> --size <size> --ssh-key-values <ssh_pub> --vnet-name <vnet> --subnet <subnet> --public-ip-address <pub_ip> --nsg <nsg> --location <loc>
az vm deallocate --resource-group <rg> --name <vm>
az vm start --resource-group <rg> --name <vm>
az vm resize --resource-group <rg> --name <vm> --size <size>
az vm list-ip-addresses --name <vm> --resource-group <rg> -o table
DISK=$(az vm show --resource-group <rg> --name <vm> --query "storageProfile.osDisk.name" -o tsv)
az disk update --resource-group <rg> --name $DISK --size-gb <size>
SNAP="<vm>-snapshot"
az snapshot create --resource-group <rg> --name $SNAP --source $DISK
NEW_DISK="<vm>-restored-disk"
az disk create --resource-group <rg> --name $NEW_DISK --source $SNAP
az network vnet list --resource-group <rg> -o table
az network vnet subnet list --resource-group <rg> --vnet-name <vnet> -o table
az network vnet create --resource-group <rg> --name <vnet> --address-prefixes <vnet_prefix> --subnet-name <subnet> --subnet-prefixes <subnet_prefix> --location <loc>
az network nsg create --resource-group <rg> --name <nsg> --location <loc>
az network nsg rule create --resource-group <rg> --nsg-name <nsg> --name AllowSSH --priority 1000 --direction Inbound --access Allow --protocol Tcp --source-port-ranges '*' --destination-port-ranges 22 --source-address-prefixes '*' --destination-address-prefixes '*'
az network nic create --resource-group <rg> --name <nic> --vnet-name <vnet> --subnet <subnet> --network-security-group <nsg> --location <loc>
az network public-ip create --resource-group <rg> --name <pub_ip> --sku Standard --allocation-method Static --location <loc>

### Terraform – Infra
terraform init
terraform validate
terraform plan
terraform apply
terraform show
terraform state list
terraform state show
terraform state pull
terraform state push
terraform destroy
terraform import <type>.<name> <id>
