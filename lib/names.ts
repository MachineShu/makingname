import { ChineseName, UserPreferences, Quality, Surname } from './types';
import namesData from '../data/names.json';
import qualitiesData from '../data/qualities.json';
import surnamesData from '../data/surnames.json';

// 获取所有品质
export function getQualities(): Quality[] {
  return qualitiesData as Quality[];
}

// 获取所有姓氏
export function getSurnames(): Surname[] {
  return surnamesData as Surname[];
}

// 根据用户偏好生成名字推荐
export function generateNames(preferences: UserPreferences): ChineseName[] {
  const allNames = namesData as ChineseName[];
  
  // 按性别筛选
  let filteredNames = allNames.filter(name => name.gender === preferences.gender);
  
  // 按品质筛选
  if (preferences.selectedQualities.length > 0) {
    filteredNames = filteredNames.filter(name => 
      preferences.selectedQualities.some(quality => 
        name.qualities.includes(quality)
      )
    );
  }
  
  // 按匹配度排序（匹配的品质越多，排名越靠前）
  filteredNames.sort((a, b) => {
    const aMatches = a.qualities.filter(q => preferences.selectedQualities.includes(q)).length;
    const bMatches = b.qualities.filter(q => preferences.selectedQualities.includes(q)).length;
    return bMatches - aMatches;
  });
  
  // 返回前15个结果
  return filteredNames.slice(0, 15);
}

// 根据ID获取单个名字
export function getNameById(id: string): ChineseName | undefined {
  const allNames = namesData as ChineseName[];
  return allNames.find(name => name.id === id);
}

// 根据ID获取姓氏
export function getSurnameById(id: string): Surname | undefined {
  const allSurnames = surnamesData as Surname[];
  return allSurnames.find(surname => surname.id === id);
}

// 文本转语音功能
export function speakText(text: string, lang: string = 'zh-CN'): void {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8; // 稍慢的语速
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }
}

// 收藏功能
export const favorites = {
  key: 'chinese-name-favorites',
  
  get(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(this.key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },
  
  add(nameId: string): void {
    if (typeof window === 'undefined') return;
    const current = this.get();
    if (!current.includes(nameId)) {
      current.push(nameId);
      localStorage.setItem(this.key, JSON.stringify(current));
    }
  },
  
  remove(nameId: string): void {
    if (typeof window === 'undefined') return;
    const current = this.get();
    const updated = current.filter(id => id !== nameId);
    localStorage.setItem(this.key, JSON.stringify(updated));
  },
  
  has(nameId: string): boolean {
    return this.get().includes(nameId);
  }
};