import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  Approval,
  AuthorizationCanceled,
  AuthorizationUsed,
  EIP712DomainChanged,
  IndexUpdated,
  StartedEarning,
  StoppedEarning,
  Transfer
} from "../generated/MToken/MToken"

export function createApprovalEvent(
  account: Address,
  spender: Address,
  amount: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return approvalEvent
}

export function createAuthorizationCanceledEvent(
  authorizer: Address,
  nonce: Bytes
): AuthorizationCanceled {
  let authorizationCanceledEvent = changetype<AuthorizationCanceled>(
    newMockEvent()
  )

  authorizationCanceledEvent.parameters = new Array()

  authorizationCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "authorizer",
      ethereum.Value.fromAddress(authorizer)
    )
  )
  authorizationCanceledEvent.parameters.push(
    new ethereum.EventParam("nonce", ethereum.Value.fromFixedBytes(nonce))
  )

  return authorizationCanceledEvent
}

export function createAuthorizationUsedEvent(
  authorizer: Address,
  nonce: Bytes
): AuthorizationUsed {
  let authorizationUsedEvent = changetype<AuthorizationUsed>(newMockEvent())

  authorizationUsedEvent.parameters = new Array()

  authorizationUsedEvent.parameters.push(
    new ethereum.EventParam(
      "authorizer",
      ethereum.Value.fromAddress(authorizer)
    )
  )
  authorizationUsedEvent.parameters.push(
    new ethereum.EventParam("nonce", ethereum.Value.fromFixedBytes(nonce))
  )

  return authorizationUsedEvent
}

export function createEIP712DomainChangedEvent(): EIP712DomainChanged {
  let eip712DomainChangedEvent = changetype<EIP712DomainChanged>(newMockEvent())

  eip712DomainChangedEvent.parameters = new Array()

  return eip712DomainChangedEvent
}

export function createIndexUpdatedEvent(
  index: BigInt,
  rate: BigInt
): IndexUpdated {
  let indexUpdatedEvent = changetype<IndexUpdated>(newMockEvent())

  indexUpdatedEvent.parameters = new Array()

  indexUpdatedEvent.parameters.push(
    new ethereum.EventParam("index", ethereum.Value.fromUnsignedBigInt(index))
  )
  indexUpdatedEvent.parameters.push(
    new ethereum.EventParam("rate", ethereum.Value.fromUnsignedBigInt(rate))
  )

  return indexUpdatedEvent
}

export function createStartedEarningEvent(account: Address): StartedEarning {
  let startedEarningEvent = changetype<StartedEarning>(newMockEvent())

  startedEarningEvent.parameters = new Array()

  startedEarningEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return startedEarningEvent
}

export function createStoppedEarningEvent(account: Address): StoppedEarning {
  let stoppedEarningEvent = changetype<StoppedEarning>(newMockEvent())

  stoppedEarningEvent.parameters = new Array()

  stoppedEarningEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return stoppedEarningEvent
}

export function createTransferEvent(
  sender: Address,
  recipient: Address,
  amount: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("recipient", ethereum.Value.fromAddress(recipient))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return transferEvent
}
