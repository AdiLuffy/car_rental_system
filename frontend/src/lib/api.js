const API = {
  async get(path) {
    const res = await fetch("http://localhost:8080/api" + path);
    return res.json();
  }
};

export default API;
