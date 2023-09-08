const axios = require('axios');

const processData = (url = `http://localhost:3000/`, data = {}, method = "POST") => {
    let m = method.toLowerCase();
    let bodyData = Object.keys(data).length === 0 ? null : JSON.stringify(data);
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
        }
    };
    if (m === "post") {
        return axios.post(url, bodyData, axiosConfig).then((response) => response.data);
    } else if (m === "get") {
        return axios.get(url, axiosConfig).then((response) => response.data);
    } else if (m === "put") {
        return axios.put(url, bodyData, axiosConfig).then((response) => response.data);
    } else if (m === "delete") {
        return axios.delete(url, axiosConfig).then((response) => response.data);
    }
}

module.exports = processData