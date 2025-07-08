import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  Claimed,
  MarketCreated,
  MarketResolved,
  MarketResolvedDetailed,
  OwnerUpdated,
  QuestionCreatorRoleGranted,
  QuestionResolveRoleGranted,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  SharesPurchased
} from "../generated/PolicastMarket/PolicastMarket"

export function createClaimedEvent(
  marketId: BigInt,
  user: Address,
  amount: BigInt
): Claimed {
  let claimedEvent = changetype<Claimed>(newMockEvent())

  claimedEvent.parameters = new Array()

  claimedEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  claimedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  claimedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return claimedEvent
}

export function createMarketCreatedEvent(
  marketId: BigInt,
  question: string,
  optionA: string,
  optionB: string,
  endTime: BigInt
): MarketCreated {
  let marketCreatedEvent = changetype<MarketCreated>(newMockEvent())

  marketCreatedEvent.parameters = new Array()

  marketCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  marketCreatedEvent.parameters.push(
    new ethereum.EventParam("question", ethereum.Value.fromString(question))
  )
  marketCreatedEvent.parameters.push(
    new ethereum.EventParam("optionA", ethereum.Value.fromString(optionA))
  )
  marketCreatedEvent.parameters.push(
    new ethereum.EventParam("optionB", ethereum.Value.fromString(optionB))
  )
  marketCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "endTime",
      ethereum.Value.fromUnsignedBigInt(endTime)
    )
  )

  return marketCreatedEvent
}

export function createMarketResolvedEvent(
  marketId: BigInt,
  outcome: i32
): MarketResolved {
  let marketResolvedEvent = changetype<MarketResolved>(newMockEvent())

  marketResolvedEvent.parameters = new Array()

  marketResolvedEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  marketResolvedEvent.parameters.push(
    new ethereum.EventParam(
      "outcome",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(outcome))
    )
  )

  return marketResolvedEvent
}

export function createMarketResolvedDetailedEvent(
  marketId: BigInt,
  outcome: i32,
  totalOptionAShares: BigInt,
  totalOptionBShares: BigInt,
  participantsLength: BigInt
): MarketResolvedDetailed {
  let marketResolvedDetailedEvent =
    changetype<MarketResolvedDetailed>(newMockEvent())

  marketResolvedDetailedEvent.parameters = new Array()

  marketResolvedDetailedEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  marketResolvedDetailedEvent.parameters.push(
    new ethereum.EventParam(
      "outcome",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(outcome))
    )
  )
  marketResolvedDetailedEvent.parameters.push(
    new ethereum.EventParam(
      "totalOptionAShares",
      ethereum.Value.fromUnsignedBigInt(totalOptionAShares)
    )
  )
  marketResolvedDetailedEvent.parameters.push(
    new ethereum.EventParam(
      "totalOptionBShares",
      ethereum.Value.fromUnsignedBigInt(totalOptionBShares)
    )
  )
  marketResolvedDetailedEvent.parameters.push(
    new ethereum.EventParam(
      "participantsLength",
      ethereum.Value.fromUnsignedBigInt(participantsLength)
    )
  )

  return marketResolvedDetailedEvent
}

export function createOwnerUpdatedEvent(
  prevOwner: Address,
  newOwner: Address
): OwnerUpdated {
  let ownerUpdatedEvent = changetype<OwnerUpdated>(newMockEvent())

  ownerUpdatedEvent.parameters = new Array()

  ownerUpdatedEvent.parameters.push(
    new ethereum.EventParam("prevOwner", ethereum.Value.fromAddress(prevOwner))
  )
  ownerUpdatedEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownerUpdatedEvent
}

export function createQuestionCreatorRoleGrantedEvent(
  account: Address
): QuestionCreatorRoleGranted {
  let questionCreatorRoleGrantedEvent =
    changetype<QuestionCreatorRoleGranted>(newMockEvent())

  questionCreatorRoleGrantedEvent.parameters = new Array()

  questionCreatorRoleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return questionCreatorRoleGrantedEvent
}

export function createQuestionResolveRoleGrantedEvent(
  account: Address
): QuestionResolveRoleGranted {
  let questionResolveRoleGrantedEvent =
    changetype<QuestionResolveRoleGranted>(newMockEvent())

  questionResolveRoleGrantedEvent.parameters = new Array()

  questionResolveRoleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return questionResolveRoleGrantedEvent
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): RoleAdminChanged {
  let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent())

  roleAdminChangedEvent.parameters = new Array()

  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  )

  return roleAdminChangedEvent
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent())

  roleGrantedEvent.parameters = new Array()

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleGrantedEvent
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent())

  roleRevokedEvent.parameters = new Array()

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleRevokedEvent
}

export function createSharesPurchasedEvent(
  marketId: BigInt,
  buyer: Address,
  isOptionA: boolean,
  amount: BigInt
): SharesPurchased {
  let sharesPurchasedEvent = changetype<SharesPurchased>(newMockEvent())

  sharesPurchasedEvent.parameters = new Array()

  sharesPurchasedEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  sharesPurchasedEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  sharesPurchasedEvent.parameters.push(
    new ethereum.EventParam("isOptionA", ethereum.Value.fromBoolean(isOptionA))
  )
  sharesPurchasedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return sharesPurchasedEvent
}
