import sinon from 'sinon';
import React from 'react';
import { shallow, mount } from 'enzyme';
import Icon from './';

describe('<Icon />', () => {

  it('renders calendar', () => {
    const icon = shallow(<Icon icon="calendar" />);

    expect(icon.length).toBe(1);
  });

  it('renders checkmark', () => {
    const icon = shallow(<Icon icon="checkmark" />);

    expect(icon.length).toBe(1);
  });

  it('renders check-circle', () => {
    const icon = shallow(<Icon icon="check-circle" />);

    expect(icon.length).toBe(1);
  });

  it('renders check-outline', () => {
    const icon = shallow(<Icon icon="check-outline" />);

    expect(icon.length).toBe(1);
  });

  it('renders chevron', () => {
    const icon = shallow(<Icon icon="chevron" />);

    expect(icon.length).toBe(1);
  });

  it('renders cross', () => {
    const icon = shallow(<Icon icon="cross" />);

    expect(icon.length).toBe(1);
  });

  it('renders cross-outline', () => {
    const icon = shallow(<Icon icon="cross-outline" />);

    expect(icon.length).toBe(1);
  });

  it('renders ellipsis', () => {
    const icon = shallow(<Icon icon="ellipsis" />);

    expect(icon.length).toBe(1);
  });

  it('renders ellipsis-vertical', () => {
    const icon = shallow(<Icon icon="ellipsis-vertical" />);

    expect(icon.length).toBe(1);
  });

  it('renders flag-circle', () => {
    const icon = shallow(<Icon icon="flag-circle" />);

    expect(icon.length).toBe(1);
  });

  it('renders info', () => {
    const icon = shallow(<Icon icon="info" />);

    expect(icon.length).toBe(1);
  });

  it('renders info-circle', () => {
    const icon = shallow(<Icon icon="info-circle" />);

    expect(icon.length).toBe(1);
  });

  it('renders plus-outline', () => {
    const icon = shallow(<Icon icon="plus-outline" />);

    expect(icon.length).toBe(1);
  });

  it('renders quote', () => {
    const icon = shallow(<Icon icon="quote" />);

    expect(icon.length).toBe(1);
  });

  it('renders error', () => {
    const icon = shallow(<Icon icon="error" />);

    expect(icon.length).toBe(1);
  });

  it('renders error-circle', () => {
    const icon = shallow(<Icon icon="error-circle" />);

    expect(icon.length).toBe(1);
  });

  it('renders with a custom size', () => {
    const icon = shallow(<Icon size={ 2 } />);

    icon.setProps({
      onClick: () => {},
    });

    expect(icon.instance().props.size).toBe(2);
  });

  it('renders with alt', () => {
    const text = 'This is an alt';
    const icon = shallow(<Icon alt={ text } />);
    const alttext = icon.find('title');

    expect(alttext.text()).toBe(text);
  });

  it('renders with all types of color options', () => {
    const iconBlue = shallow(<Icon color="blue" />);
    const iconButton = shallow(<Icon color="button" />);
    const iconAction = shallow(<Icon color="action" />);
    const iconSelection = shallow(<Icon color="selection" />);
    const iconBrand = shallow(<Icon color="brand" />);
    const iconAlertOrange = shallow(<Icon color="alert-orange" />);
    const iconAlertYellow = shallow(<Icon color="alert-yellow" />);
    const iconAlertGreen = shallow(<Icon color="alert-green" />);
    const iconAlertBlue = shallow(<Icon color="alert-blue" />);
    const iconAlertRed = shallow(<Icon color="alert-red" />);
    const iconBlack = shallow(<Icon color="black" />);
    const iconGrayDark = shallow(<Icon color="gray-dark" />);
    const iconGray = shallow(<Icon color="gray" />);
    const iconGrayLight = shallow(<Icon color="gray-light" />);
    const iconGrayLighter = shallow(<Icon color="gray-lighter" />);
    const iconWhite = shallow(<Icon color="white" />);
    const iconGreenLight = shallow(<Icon color="green-light" />);
    const iconTealLight = shallow(<Icon color="teal-light" />);

    expect(iconBlue.instance().props.color).toBe('blue');
    expect(iconButton.instance().props.color).toBe('button');
    expect(iconAction.instance().props.color).toBe('action');
    expect(iconSelection.instance().props.color).toBe('selection');
    expect(iconBrand.instance().props.color).toBe('brand');
    expect(iconAlertOrange.instance().props.color).toBe('alert-orange');
    expect(iconAlertYellow.instance().props.color).toBe('alert-yellow');
    expect(iconAlertGreen.instance().props.color).toBe('alert-green');
    expect(iconAlertBlue.instance().props.color).toBe('alert-blue');
    expect(iconAlertRed.instance().props.color).toBe('alert-red');
    expect(iconBlack.instance().props.color).toBe('black');
    expect(iconGrayDark.instance().props.color).toBe('gray-dark');
    expect(iconGray.instance().props.color).toBe('gray');
    expect(iconGrayLight.instance().props.color).toBe('gray-light');
    expect(iconGrayLighter.instance().props.color).toBe('gray-lighter');
    expect(iconWhite.instance().props.color).toBe('white');
    expect(iconGreenLight.instance().props.color).toBe('green-light');
    expect(iconTealLight.instance().props.color).toBe('teal-light');
  });

  it('renders with custom classname', () => {
    const icon = shallow(<Icon className="awesome" />);

    icon.setProps({
      onClick: () => {},
    });

    expect(icon.instance().props.className).toBe('awesome');
  });

  it('renders random prop', () => {
    const icon = shallow(<Icon hidden="true" />);

    icon.setProps({
      onClick: () => {},
    });

    expect(icon.instance().props.hidden).toBe('true');
  });

});
