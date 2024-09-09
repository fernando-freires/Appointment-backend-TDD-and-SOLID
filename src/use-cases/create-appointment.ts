import { Appointment } from "../entities/appointment";
import { AppointmentsRepository } from "../repositories/appointment-repository";

interface CreateAppointmentRequest {
  customer: string;
  startsAt: Date;
  endsAt: Date;
}

type CreateAppointmentResponse = Appointment;

export class CreateAppointment {
  constructor(private appointmentsRepository: AppointmentsRepository) {}

  async execute({
    customer,
    startsAt,
    endsAt,
  }: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
    const overlappintAppointment =
      await this.appointmentsRepository.findOverlappingAppointment(
        startsAt,
        endsAt
      );

    if (overlappintAppointment) {
      throw new Error("Another appointment overlaps this appointment dates");
    }

    const appointment = new Appointment({
      customer,
      startsAt,
      endsAt,
    });

    await this.appointmentsRepository.create(appointment);

    return appointment;
  }
}
