import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  BackHandler,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import routesData from '../../../components/FooterRoutes/routesData';


type RootStackParamList = {
  DashboardFather: { studentName: string; avatarUri?: string };
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>; 

const STUDENT_DATA_LIST = (() => {
  const names: string[] = [];
  routesData.forEach(r => {
    (r.stops || []).forEach(s => {
      if (s.student && !names.includes(s.student)) names.push(s.student);
    });
  });
  return names.map((name, idx) => ({
    id: String(idx + 1),
    name,
    uri: `https://i.pravatar.cc/150?img=${(idx % 70) + 1}`,
  }));
})();

interface StudentCardProps {
  name: string;
  imageUri: string;
  onPress: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({
  name,
  imageUri,
  onPress,
}) => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const passMapStudent = React.useCallback(() => {
    navigation.replace('DashboardFather', { studentName: name, avatarUri: imageUri });
  }, [navigation, name, imageUri]);
  
  return (
    <TouchableOpacity style={styles.studentCard} onPress={onPress}>
      <View style={styles.studentInfo}>
        <Image source={{ uri: imageUri }} style={styles.studentImage} />
        <Text style={styles.studentNameText}>{name}</Text>
      </View>
      <TouchableOpacity onPress={passMapStudent} style={styles.actionButtonContainer}>
        <Text style={styles.actionButtonText}>
          {'>'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const StudentListSection: React.FC = () => {
  const handleStudentPress = React.useCallback((name: string) => {

    console.log(`Abriendo detalles de ${name}`);
  }, []);

  const renderItem = React.useCallback(
    ({ item }: { item: { id: string; name: string; uri: string } }) => (
      <StudentCard
        name={item.name}
        imageUri={item.uri}
        onPress={() => handleStudentPress(item.name)}
      />
    ),
    [handleStudentPress]
  );

  const renderSeparator = React.useCallback(() => <View style={styles.separator} />, []);

  return (
    <View style={styles.listSection}>
      <FlatList
        data={STUDENT_DATA_LIST}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        scrollEnabled={false}
      />
    </View>
  );
};

interface AddStudentButtonProps {
  onAddStudentPress: () => void;
}

const AddStudentButton: React.FC<AddStudentButtonProps> = ({
  onAddStudentPress,
}) => {
  return (
    <View style={styles.addButtonWrapper}>
      <Text style={styles.addButtonTitle}>Agrega Nuevo estudiante</Text>
      <TouchableOpacity style={styles.addButton} onPress={onAddStudentPress}>
        <Text style={styles.addButtonText}>Agregar</Text>
      </TouchableOpacity>
    </View>
  );
};

const EjeSchoolComponent: React.FC = () => {
  const handleAddStudent = () => {
    
    console.log('Abrir modal/pantalla para agregar estudiante.');
  };

  React.useEffect(() => {
    const blockBack = () => true; // permanecer en PageFather, sin salir ni retroceder
    const sub = BackHandler.addEventListener('hardwareBackPress', blockBack);
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Estudiantes</Text>
      </View>

      <StudentListSection />

      <AddStudentButton onAddStudentPress={handleAddStudent} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
    backgroundColor: '#5d01bc',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },

  listSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 10,
  },

  studentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentImage: {
    width: 40,
    height: 40,
    borderRadius: 22.5,
    marginRight: 15,
  },
  studentNameText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#333',
  },
  actionButtonContainer: {
    width: 45,
    height: 29,
    borderRadius: 17.5,
    backgroundColor: '#49d96a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 60,
  },

  addButtonWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 10,
  },
  addButtonTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#5d01bc',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical:8,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButtonText: { color: '#fff', fontSize: 20, textAlign: 'center' },
});

export default EjeSchoolComponent;
