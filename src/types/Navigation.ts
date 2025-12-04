export type RootStackParamList = {
  InitialLogins: undefined;
  LoginFather: undefined;
  LoginDriver: undefined;
  RegisterStudent: undefined;
  PageDriver: undefined;
  PageFather: undefined;
  DashboardFather: undefined;
  ChatSupport: {
    userRole: 'padre' | 'conductor';
    recipientName: string;
    recipientAvatar?: string;
  };
  Notifications: undefined;
  MyAccount: undefined;
  Historias: undefined;
  vehicleVerification: undefined;
};