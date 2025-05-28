// 用户性别类型
export type Gender = 'male' | 'female';

// 品质/特质类型
export interface Quality {
  id: string;
  name: string;
  nameZh: string;
  description: string;
}

// 中文名字类型
export interface ChineseName {
  id: string;
  characters: string; // 汉字
  pinyin: string; // 拼音
  tone: string; // 声调标记
  meaning: string; // 含义
  gender: Gender; // 适用性别
  qualities: string[]; // 相关品质ID数组
  culturalNote?: string; // 文化说明
}

// 姓氏类型
export interface Surname {
  id: string;
  character: string; // 姓氏汉字
  pinyin: string; // 拼音
  popularity: number; // 流行度 1-10
}

// 用户偏好类型
export interface UserPreferences {
  gender: Gender;
  selectedQualities: string[]; // 选中的品质ID数组
  surname?: string; // 可选的姓氏
}

// 完整名字（姓+名）类型
export interface FullName {
  surname: Surname;
  givenName: ChineseName;
  fullCharacters: string; // 完整汉字
  fullPinyin: string; // 完整拼音
}

// 收藏的名字类型
export interface FavoriteName {
  id: string;
  nameId: string;
  surnameId?: string;
  addedAt: Date;
}