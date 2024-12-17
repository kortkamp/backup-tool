import { SESClient, SendEmailCommand, SendTemplatedEmailCommand } from '@aws-sdk/client-ses';


import { ISendMessageDTO } from '../dtos/ISendMessageDTO';
import { logger } from '../../../utils/logger';
import { INotificationsProvider } from '../model/INotificationsProvider';

class SesNotificationsProvider implements INotificationsProvider {
  private client: SESClient;
  constructor() {
    this.client = new SESClient({ region: process.env.AWS_SES_REGION });
  }
  public async sendNotification({
    message,
  }: ISendMessageDTO) {

    const sendMailCommand = new SendEmailCommand({
      Destination: { 
        ToAddresses: [process.env.ADMIN_EMAIL] 
      },
      Source: process.env.SENDER_EMAIL,
      Message: {
        Body: {
          Text: {
            Data: message
          } 
        },
        Subject: {
          Data: 'Backup tool notification'
        }
      },

    });

    try {
      const result = await this.client.send(sendMailCommand);
      logger.debug(result);
    } catch (err) {
      logger.error('Ses', err);
      throw new Error(err)
    }
  }
}

export { SesNotificationsProvider };
