const rideQueries = require('../db/queries/ride.queries');
const rideInstanceQueries = require('../db/queries/rideInstance.queries');
const requestQueries = require('../db/queries/rideRequest.queries');
const userQueries = require('../db/queries/user.queries');

const createRequest = async (userId, { ride_id, seats_requested = 1 }) => {
  if (!ride_id) throw new Error('ride_id is required');

  // passenger בלבד
  const role = await userQueries.getUserRole(userId);
  if (role.name !== 'passenger') {
    throw new Error('Only passengers can request rides');
  }

  const instance = await rideInstanceQueries.getById(ride_id);
  const ride = await rideQueries.getRideById(instance.ride_id)
  if (!ride || ride.status !== 'active') {
    throw new Error('Ride not available');
  }

  if (ride.driver_id === userId) {
    throw new Error('Driver cannot join own ride');
  }

  // 🔹 שליפת המופע (MVP – מופע אחד)
  if (!instance) {
    throw new Error('Ride instance not found');
  }

  if (instance.seats_available < seats_requested) {
    throw new Error('Not enough seats');
  }

  const exists = await requestQueries.findExisting(userId, instance.id);
  if (exists) {
    throw new Error('Request already exists');
  }

  return await requestQueries.createRequest({
    instance_id: instance.id,
    passenger_id: userId,
    seats_requested
  });
};

const approveRequest = async (driverId, requestId) => {
  const request = await requestQueries.getById(requestId);
  if (!request) throw new Error('Request not found');

  if (request.status == 'approved') {
    throw new error ('The request is already approved')
  }

  const instance = await rideInstanceQueries.getById(request.instance_id);
  const ride = await rideQueries.getRideById(instance.ride_id);

  if (ride.driver_id !== driverId) {
    throw new Error('Only driver can approve');
  }

  if (instance.seats_available < request.seats_requested) {
    throw new Error('Not enough seats');
  }

  await rideInstanceQueries.decreaseSeats(
    instance.id,
    request.seats_requested
  );

  await requestQueries.updateStatus(requestId, 'approved');

  return { message: 'Request approved' };
};

const rejectRequest = async (driverId, requestId) => {
  const request = await requestQueries.getById(requestId);
  if (!request) throw new Error('Request not found');

  if (request.status == 'approved') {
    throw new error ('You cannot reject approved request')
  }

  const instance = await rideInstanceQueries.getById(request.instance_id);
  const ride = await rideQueries.getRideById(instance.ride_id);

  if (ride.driver_id !== driverId) {
    throw new Error('Only driver can reject');
  }

  await requestQueries.updateStatus(requestId, 'rejected');
  return { message: 'Request rejected' };
};

module.exports = {
  createRequest,
  approveRequest,
  rejectRequest
};
