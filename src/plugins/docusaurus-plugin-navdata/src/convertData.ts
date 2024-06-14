import IFooterData from './interfaces/navbar/footerData';
import ILink from './interfaces/navbar/link';
import INavData from './interfaces/navbar/navData';
import ISocialMedia from './interfaces/navbar/socialMedia';
const convertData = (
  source: any
): {
  footerData: Array<IFooterData>;
  navTree: Array<any>;
  footerTree: Array<any>;
} => {
  const navTreeTranslations = [];
  for (const translation of source.data.header.translations) {
    const navTreeTranslation = convertNavTree(translation);
    navTreeTranslations.push(navTreeTranslation);
  }

  const footerTreeTranslations = [];
  for (const translation of source.data.footer.translations) {
    footerTreeTranslations.push(translation);
  }
  const footerDatas: Array<IFooterData> = [];
  for (const translation of source.data.footer.translations) {
    if (!translation.logo || !translation.title) {
      continue;
    }
    const footerData: IFooterData = convertFooterData(translation);
    for (const sourceLink of translation.bottom_links) {
      const link: ILink = convertLink(sourceLink.link_id);
      footerData.bottomLinks.push(link);
    }
    footerDatas.push(footerData);
  }
  return {
    footerData: footerDatas,
    navTree: navTreeTranslations,
    footerTree: footerTreeTranslations,
  };
};
export default convertData;
const convertLink = (source: any): ILink => {
  return {
    title: source.title,
    type: source.type,
    url: source.url,
    children: [],
    openInNewTab: source.open_in_new_tab ?? false,
  };
};
const convertSocialMedia = (source: any): ISocialMedia[] => {
  return source.map((data: any) => {
    return {
      name: data.social_media_id.name,
      url: data.social_media_id.url,
      iconId: data.social_media_id.icon.id,
      icon: '',
    };
  });
};

const convertFooterData = (source: any): IFooterData => {
  return {
    languageCode: source.languages_code.code.toLocaleLowerCase(),
    logoId: source?.logo?.id,
    title: source?.title,
    description: source?.description,
    logo: '',
    bottomLinks: [],
    columns: [],
    manage_cookies_text: source?.manage_cookies_text,
    social_media: convertSocialMedia(source.social_media),
  };
};

const convertNavTree = (source: any): INavData => {
  return {
    ...source,
    social_media: convertSocialMedia(source.social_media),
  };
};
