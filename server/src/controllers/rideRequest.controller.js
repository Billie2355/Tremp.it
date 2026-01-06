const service = require('../services/rideRequest.service');

const createRequest = async (req, res) => {
  try {
    const request = await service.createRequest(req.user.id, req.body);
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const approveRequest = async (req, res) => {
  try {
    const result = await service.approveRequest(req.user.id, req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const result = await service.rejectRequest(req.user.id, req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await service.getMyRequests(userId);

    res.json(requests);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


module.exports = {
  createRequest,
  approveRequest,
  rejectRequest,
  getMyRequests
};
