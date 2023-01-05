import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application.json'
    }
});

export default {
    getPersons(pageSize, pageNo) {
        return apiClient.get('/persons' + '/?_limit=' + pageSize + '&_page=' + pageNo)
    },
    getPerson(id) {
        return apiClient.get('/persons/' + id)
    }
};
