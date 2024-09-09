import { describe, expect, it } from "vitest";
import { CreateAppointment } from "./create-appointment";
import { Appointment } from "../entities/appointment";
import { getFutureDate } from "../tests/utils/get-future-date";
import { InMemoryAppointmentsRepository } from "../repositories/in-memory/in-memory-appointment-repository";

describe("Create Appointment", () => {
  it("should be able to create an appointment", () => {
    const appointmentsRepository = new InMemoryAppointmentsRepository();
    const createAppointment = new CreateAppointment(appointmentsRepository);

    const startsAt = getFutureDate("2024-09-08");
    const endsAt = getFutureDate("2024-09-09");

    startsAt.setDate(endsAt.getDate() + 1);
    endsAt.setDate(endsAt.getDate() + 2);

    expect(
      createAppointment.execute({
        customer: "John Doe",
        startsAt,
        endsAt,
      })
    ).resolves.toBeInstanceOf(Appointment);
  });

  it("should not be able to create an appointment with overlapping dates", async () => {
    const appointmentsRepository = new InMemoryAppointmentsRepository();
    const createAppointment = new CreateAppointment(appointmentsRepository);

    const startsAt = getFutureDate("2024-09-10");
    const endsAt = getFutureDate("2024-09-15");

    startsAt.setDate(endsAt.getDate() + 1);
    endsAt.setDate(endsAt.getDate() + 2);

    await createAppointment.execute({
      customer: "John Doe",
      startsAt,
      endsAt,
    });

    expect(
      createAppointment.execute({
        customer: "John Doe",
        startsAt: getFutureDate("2024-09-13"),
        endsAt: getFutureDate("2024-09-18"),
      })
    ).rejects.toBeInstanceOf(Error);

    expect(
      createAppointment.execute({
        customer: "John Doe",
        startsAt: getFutureDate("2024-09-13"),
        endsAt: getFutureDate("2024-09-12"),
      })
    ).rejects.toBeInstanceOf(Error);

    expect(
      createAppointment.execute({
        customer: "John Doe",
        startsAt: getFutureDate("2024-09-05"),
        endsAt: getFutureDate("2024-09-20"),
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
