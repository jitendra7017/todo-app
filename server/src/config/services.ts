import JsonDogDAO from '../infrastructure/data-access/json/dogDAO'

const dogDAO = new JsonDogDAO()

export default {
  dog: {
    DAO: JsonDogDAO,
    dao: dogDAO,
  },
}
