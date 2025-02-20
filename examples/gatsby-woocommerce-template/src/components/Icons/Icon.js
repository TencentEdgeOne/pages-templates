import React from 'react';

// Alphabetical order please
import Arrow from './Arrow';
import Bag from './Bag';
import BagPlus from './BagPlus';
import Burger from './Burger';
import Caret from './Caret';
import Check from './Check';
import CreditCard from './CreditCard';
import Cross from './Cross';
import Cycle from './Cycle';
import Delivery from './Delivery';
import Facebook from './Facebook';
import FacebookInverse from './FacebookInverse';
import Filter from './Filter';
import Heart from './Heart';
import HeartFill from './HeartFill';
import Instagram from './Instagram';
import List from './List';
import Logout from './Logout';
import Minus from './Minus';
import Phone from './Phone';
import PinterestInverse from './PinterestInverse';
import Plus from './Plus';
import Question from './Question';
import Search from './Search';
import Twitter from './Twitter';
import TwitterInverse from './TwitterInverse';
import User from './User';
import Youtube from './Youtube';

function Icon(props) {
  switch (props.symbol) {
    case 'arrow':
      return <Arrow />;
    case 'bag':
      return <Bag />;
    case 'bagPlus':
      return <BagPlus />;
    case 'burger':
      return <Burger />;
    case 'caret':
      return <Caret />;
    case 'check':
      return <Check />;
    case 'creditcard':
      return <CreditCard />;
    case 'cross':
      return <Cross />;
    case 'cycle':
      return <Cycle />;
    case 'delivery':
      return <Delivery />;
    case 'facebook':
      return <Facebook />;
    case 'facebookinverse':
      return <FacebookInverse />;
    case 'filter':
      return <Filter />;
    case 'heart':
      return <Heart />;
    case 'heartFill':
      return <HeartFill />;
    case 'instagram':
      return <Instagram />;
    case 'list':
      return <List />;
    case 'logout':
      return <Logout />;
    case 'minus':
      return <Minus />;
    case 'phone':
      return <Phone />;
    case 'pinterestinverse':
      return <PinterestInverse />;
    case 'plus':
      return <Plus />;
    case 'question':
      return <Question />;
    case 'search':
      return <Search />;
    case 'twitter':
      return <Twitter />;
    case 'twitterinverse':
      return <TwitterInverse />;
    case 'user':
      return <User />;
    case 'youtube':
      return <Youtube />;
    default:
      return <span>Unknown icon: {props.symbol}</span>;
  }
}

export default Icon;
