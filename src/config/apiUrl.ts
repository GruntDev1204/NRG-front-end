const apiHost = "http://127.0.0.1:8000/api/"

export enum api {
  //user
  getUsers = apiHost + "users",
  //manager
  changeUserRole = apiHost + "users/manager",
}
