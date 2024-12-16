import { ISendMessageDTO } from '../dtos/ISendMessageDTO';

interface INotificationsProvider {
  sendNotification(data: ISendMessageDTO): Promise<void>;
}

export { INotificationsProvider };
