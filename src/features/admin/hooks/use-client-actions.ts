import { useMemo } from "react";

import { runAdminAction } from "../feedback/run-admin-action";
import {
  useConfirmHairProfile,
  useCreateClient,
  useRecordConsent,
  useSetHairProfile,
  useUpdateClient,
} from "./use-clients";

import {
  HEALTH_DATA_POLICY_VERSION,
  type ClientView,
  type CreateClientRequest,
  type SetHairProfileRequest,
  type UpdateClientRequest,
} from "../types/clients.types";

export interface ClientActions {
  create: (data: CreateClientRequest) => Promise<ClientView | null>;
  update: (clientId: string, data: UpdateClientRequest) => Promise<boolean>;
  setHairProfile: (
    clientId: string,
    data: SetHairProfileRequest,
  ) => Promise<boolean>;
  confirmHairProfile: (clientId: string) => Promise<boolean>;
  recordHealthConsent: (clientId: string) => Promise<boolean>;
  isSaving: boolean;
}

export function useClientActions(): ClientActions {
  const create = useCreateClient();
  const update = useUpdateClient();
  const setHair = useSetHairProfile();
  const confirmHair = useConfirmHairProfile();
  const consent = useRecordConsent();

  const { mutateAsync: createAsync } = create;
  const { mutateAsync: updateAsync } = update;
  const { mutateAsync: setHairAsync } = setHair;
  const { mutateAsync: confirmHairAsync } = confirmHair;
  const { mutateAsync: consentAsync } = consent;

  const actions = useMemo(
    () => ({
      create: async (data: CreateClientRequest) => {
        const outcome = await runAdminAction("createClient", () =>
          createAsync(data),
        );
        return outcome.ok ? outcome.value : null;
      },
      update: async (clientId: string, data: UpdateClientRequest) =>
        (await runAdminAction("updateClient", () => updateAsync({ clientId, data })))
          .ok,
      setHairProfile: async (clientId: string, data: SetHairProfileRequest) =>
        (
          await runAdminAction("setHairProfile", () =>
            setHairAsync({ clientId, data }),
          )
        ).ok,
      confirmHairProfile: async (clientId: string) =>
        (await runAdminAction("confirmHairProfile", () => confirmHairAsync(clientId)))
          .ok,
      recordHealthConsent: async (clientId: string) =>
        (
          await runAdminAction("recordConsent", () =>
            consentAsync({
              clientId,
              data: {
                type: "DATOS_SALUD",
                policyVersion: HEALTH_DATA_POLICY_VERSION,
              },
            }),
          )
        ).ok,
    }),
    [createAsync, updateAsync, setHairAsync, confirmHairAsync, consentAsync],
  );

  return {
    ...actions,
    isSaving:
      create.isPending ||
      update.isPending ||
      setHair.isPending ||
      confirmHair.isPending ||
      consent.isPending,
  };
}
