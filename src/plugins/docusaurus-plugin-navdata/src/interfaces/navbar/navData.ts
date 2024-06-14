import INavItem from './navItem';
import ISocialMedia from './socialMedia';

export default interface INavData {
  navItems: Array<INavItem>;
  languageCode: string;
  loginText: string;
  searchPlaceholder: string;
  logoId: string;
  logo: string;
  social_media: ISocialMedia[];
}
