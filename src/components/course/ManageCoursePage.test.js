import React from 'react';
import { shallow } from 'enzyme'
import { ManageCoursePage } from './ManageCoursePage';
import CourseForm from './CourseForm';

describe('ManageCoursePage', () => {
  let instance, props, state, wrapper;

  beforeEach(() => {
    onSave={this.saveCourse}
    onChange={this.updateCourseState}
    props = {
      authors: [],
      course: {},
    };
    wrapper = shallow(<ManageCoursePage {...props} />);
    instance = wrapper.instance();
  })

  it('renders CourseForm', () => {
    const element = wrapper.find(CourseForm);

    expect(element).toBePresent();

    const { allAuthors, onSave, onChange, course, errors, saving } = element.props();

    expect(allAuthors).toBe(props.authors);
    expect(onSave).toBe(instace.onSave);
    expect(onChange).toBe(instace.updateCourseState);
    expect(course).toBe(instance.state.course);
    expect(errors).toBe(instance.state.errors);
    expect(saving).toBe(instance.state.saving);
  });
});

describe('ManageCoursePage.prototype', () => {
  describe('componentWillReceiveProps', () => {
    it('calls setState with the next course if it is different', () => {
      const props = {
        course: {
          id: '1',
        },
      };
      const nextProps = {
        course: {
          id: '2',
        },
      };
      const setState = jest.fn();

      ManageCoursePage.prototype.call({ props, setState }, nextProps);

      expect(setState).toHaveBeenCalledWith({ course: nextProps.course });
    });

    it('does not call setState with the next course if it is not different', () => {
      const props = {
        course: {
          id: '1',
        },
      };
      const nextProps = {
        course: {
          id: '1',
        },
      };
      const setState = jest.fn();

      ManageCoursePage.prototype.call({ props, setState }, nextProps);

      expect(setState).not.toHaveBeenCalled();
    });
  });

  describe('updateCourseState', () => {
    it('calls setState with the next course if it is different', () => {
      const event = {
        target: {
          name: 'courseName',
          value: 'best course',
        }
      };
      const state = {
        course: {},
      };

      const setState = jest.fn();

      ManageCoursePage.prototype.updateCourseState.call({ setState, state }, event);

      expect(setState).toHaveBeenCalledWith({ course: { courseName: 'best course' } });
    });
  });

  describe('saveCourse', () => {
    let event, redirect, setState, state, toastr;

    beforeEach(() => {
      event = {
        preventDefault: jest.fn(),
      };
      redirect = jest.fn();
      setState = jest.fn();
      state = {
        course: {
          courseName: 'best course',
        },
      };
      toastr = {
        error: jest.fn();
      };
    });

    it('calls redirect if props.actions.saveCourse resolves', () => {
      const props = {
        actions: {
          saveCourse: jest.fn(() => Promise.resolve()),
        },
      };

      ManageCoursePage.prototype.saveCourse.call({ props, setState, state, toastr, redirect }, event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(props.actions.saveCourse).toHaveBeenCalledWith(state.course);
      expect(redirect).toHaveBeenCalled();
    });

    it('calls toastr.error and setState if props.actions.saveCourse rejects', () => {
      const error = new Error('something went wrong');
      const props = {
        actions: {
          saveCourse: jest.fn(() => Promise.reject(error)),
        },
      };

      ManageCoursePage.prototype.saveCourse.call({ props, setState, state, toastr, redirect }, event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(props.actions.saveCourse).toHaveBeenCalledWith(state.course);
      expect(toastr.error).toHaveBeenCalledWith(error);
      expect(setState).toHaveBeenCalledWith({ saving: false });
    });
  });

  describe('redirect', () => {
    let props, redirect, toastr;

    beforeEach(() => {
      event = {
        preventDefault: jest.fn(),
      };
      redirect = jest.fn();
    });

    it('calls redirect if props.actions.saveCourse resolves', () => {
      const props = {
        router: {
          push: jest.fn(),
        },
      };
      const setState = jest.fn();
      const toastr = {
        success: jest.fn();
      };

      ManageCoursePage.prototype.redirect.call({ props, setState, toastr });

      expect(setState).toHaveBeenCalledWith({ saving: false });
      expect(toastr.success).toHaveBeenCalledWith('Course saved!');
      expect(props.router.push).toHaveBeenCalledWith('/courses');
    });
  });
});
