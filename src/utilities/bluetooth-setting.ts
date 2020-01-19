const UUID = {
  SERVICE: '03b80e5a-ede8-4b33-a751-6ce34ec4c700',
  CHARACTERISTIC: '7772e5db-3868-4112-a1a9-f2669d106bf3',
};

export async function getBluetoothAccess() {
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: [UUID.SERVICE] }],
  });
  const server = await device.gatt.connect();
  const service = await server.getPrimaryService(UUID.SERVICE);
  const characteristic = await service.getCharacteristic(UUID.CHARACTERISTIC);
  await characteristic.startNotifications();

  return characteristic;
}
