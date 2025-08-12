
export interface CardSection {
  title: string;
  description: string;
}

export interface CardData {
  id: number;
  personality: CardSection;
  toneOfVoice: CardSection;
  critique: CardSection;
}
